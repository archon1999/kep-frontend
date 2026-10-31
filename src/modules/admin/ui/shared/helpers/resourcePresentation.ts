import type { AdminDetail, AdminField, AdminList, AdminResource } from 'modules/admin/domain';

export const primaryResources = [
  'backend.problem',
  'projects.project',
  'testing.test',
  'backend.contest',
  'challenges.challenge',
  'challenges.arena',
  'hackathons.hackathon',
  'tournaments.tournament',
  'backend.user',
  'blog.blog',
  'home.systemupdate',
  'marketplace.marketplaceorder',
  'marketplace.product',
  'backend.attempt',
  'projects.projectattempt',
  'contests.contestquestion',
];
export const isPrimaryResource = (resource: Pick<AdminResource, 'key'>) =>
  primaryResources.includes(resource.key);

const preferred: Record<string, string[]> = {
  'backend.problem': ['difficulty', 'problem_rating', 'hidden', 'author'],
  'backend.user': ['kepcoin', 'streak', 'get_last_seen'],
  'backend.contest': ['type', 'start_time', 'finish_time'],
  'projects.project': ['in_the_pipeline', 'level', 'purchase_kepcoin_value', 'file_accept'],
  'testing.test': ['difficulty', 'duration', 'get_questions_count', 'hidden'],
  'blog.blog': ['status', 'author', 'published_at'],
  'backend.attempt': ['get_verdict_html', 'user', 'created'],
};

export function listPresentation(data: AdminList) {
  const names = data.columns.map((column) => column.name);
  const identity =
    ['title', 'username', 'name', 'display_title', 'body', 'question', 'problem', 'user'].find(
      (name) => names.includes(name),
    ) ??
    names.find((name) => name !== 'id') ??
    names[0];
  const secondary =
    identity === 'username' && names.includes('get_full_name') ? 'get_full_name' : undefined;
  const available = names.filter((name) => !['id', identity, secondary].includes(name));
  const columns = [...(preferred[data.resource.key] ?? []), ...available].filter(
    (name, index, all) => available.includes(name) && all.indexOf(name) === index,
  );
  return { identity, secondary, columns, defaults: columns.slice(0, 4) };
}

export interface EditorGroup {
  key: string;
  icon: string;
  fields: AdminField[];
}

export function defaultEditorLanguage(record: AdminDetail, preferred = 'uz') {
  const languages = ['uz', 'ru', 'en'];
  const locale = languages.includes(preferred) ? preferred : 'uz';
  const translated = record.fields.filter((field) => /_(uz|ru|en)$/.test(field.name));
  const required = translated.find((field) => field.required)?.name.slice(-2);
  if (!record.id) return required || locale;
  const titles = translated.filter((field) => /^(title|name)_/.test(field.name));
  const candidates = titles.length ? titles : translated;
  const filled = languages.filter((lang) =>
    candidates.some((field) => {
      if (!field.name.endsWith('_' + lang)) return false;
      const value = record.values[field.name];
      const text =
        value && typeof value === 'object'
          ? String((value as { html?: string }).html ?? '')
          : String(value ?? '');
      return Boolean(text.replace(/<[^>]+>/g, '').trim());
    }),
  );
  return filled.includes(locale) ? locale : filled[0] || required || locale;
}
const root = (field: AdminField) => field.name.replace(/_(uz|ru|en)$/, '');
const content =
  /^(title|name|username|first_name|last_name|email|slug|body|description.*|sub_text|input_data|output_data|comment|text|question|answer|source_code|error_message|instructions|content|value)$/;
const media = /^(image|logo|og_image|cover.*|avatar|file|attachment)$/;
const publishing =
  /^(status|hidden|in_the_pipeline|private|is_rated|is_active|published_at|author|creator|user|chapter|difficulty|level|type|category|participation_type|purchase_kepcoin_value|kepcoin_reward_value)$/;
const technical =
  /^(temp|.*_normalized|judge_summary|checker_key|canonical_link|table_of_contents|views|reward_granted_at|password.*|usable_password|last_login|date_joined|is_superuser|is_staff|groups|user_permissions|permissions)$/;

/** Presentation only: every field returned by the permission-scoped schema has a home. */
export function editorPresentation(record: AdminDetail) {
  const groups: EditorGroup[] = [
    { key: 'content', icon: 'mdi:text-box-edit-outline', fields: [] },
    { key: 'settings', icon: 'mdi:tune', fields: [] },
    { key: 'media', icon: 'mdi:image-outline', fields: [] },
    { key: 'advanced', icon: 'mdi:cog-outline', fields: [] },
  ];
  const side: AdminField[] = [];
  for (const field of record.fields) {
    const name = root(field);
    if (!record.id && /^(password\d*|usable_password)$/.test(name)) groups[0].fields.push(field);
    else if (publishing.test(name)) side.push(field);
    else {
      const key =
        media.test(name) || ['file', 'image'].includes(field.kind)
          ? 'media'
          : technical.test(name) || ['json', 'secret'].includes(field.kind)
            ? 'advanced'
            : content.test(name) || ['richText', 'textarea'].includes(field.kind)
              ? 'content'
              : 'settings';
      groups.find((group) => group.key === key)!.fields.push(field);
    }
  }
  if (!groups.some((group) => group.fields.length) && side.length)
    groups[1].fields.push(...side.splice(0));
  if (
    record.fields.length <= 6 &&
    !record.inlines?.length &&
    !side.length &&
    !groups[2].fields.length &&
    !groups[3].fields.length &&
    groups[0].fields.length &&
    groups[1].fields.length
  ) {
    groups[0].key = 'details';
    groups[0].fields.push(...groups[1].fields.splice(0));
  }
  // Short identity inputs belong before long editors, in the same order across resources.
  const priority = [
    'username',
    'title',
    'name',
    'slug',
    'sub_text',
    'description_short',
    'body',
    'description',
    'input_data',
    'output_data',
    'comment',
  ];
  groups[0].fields.sort((a, b) => {
    const aIndex = priority.indexOf(root(a));
    const bIndex = priority.indexOf(root(b));
    return (aIndex < 0 ? 100 : aIndex) - (bIndex < 0 ? 100 : bIndex);
  });
  return { groups: groups.filter((group) => group.fields.length), side };
}

export function semanticColor(
  name: string,
  display: string,
): 'success' | 'warning' | 'error' | 'info' | 'neutral' | undefined {
  if (!/status|verdict|difficulty|level/.test(name)) return undefined;
  const text = display.toLocaleLowerCase();
  if (/inactive|nofaol|неактив|unpublished|not accepted/.test(text)) return 'neutral';
  if (
    /accept|publish|approv|active|beginner|basic|easy|qabul|nashr|faol|легк|принят|опублик/.test(
      text,
    )
  )
    return 'success';
  if (/fail|reject|wrong|hard|extrem|error|rad |xato|ошиб|отклон|невер/.test(text)) return 'error';
  if (/pend|queue|running|medium|draft|kutil|qoralama|очеред|чернов|ожида/.test(text))
    return 'warning';
  return 'info';
}
