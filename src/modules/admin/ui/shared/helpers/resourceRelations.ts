import type { AdminResource } from 'modules/admin/domain';

export const resourceWorkspaces = [
  [
    'backend.user',
    'backend.team',
    'social_django.usersocialauth',
    'backend.useractivityhistory',
    'backend.userfollower',
  ],
  [
    'backend.problem',
    'backend.attempt',
    'backend.chapter',
    'backend.tag',
    'backend.category',
    'problems.problemsolution',
    'problems.studyplan',
  ],
  [
    'backend.contest',
    'contests.contestquestion',
    'backend.contestant',
    'backend.contestregistrant',
    'contests.virtualcontestant',
    'contests.contesttype',
    'contests.category',
    'contests.filter',
  ],
  [
    'challenges.challenge',
    'challenges.challengeplayer',
    'challenges.ronpair',
    'challenges.challengesrating',
    'challenges.challengecall',
    'challenges.arena',
  ],
  ['projects.project', 'projects.projectattempt'],
  ['testing.test', 'testing.question', 'testing.testpassresult', 'testing.testpassresultquestion'],
  [
    'achievements.achievement',
    'achievements.userachievementprogress',
    'achievements.competitionprize',
  ],
  [
    'daily_tasks.dailytasks',
    'daily_tasks.dailytask',
    'daily_tasks.task',
    'daily_tasks.userdailytaskcompletion',
  ],
  ['kepcoin.userkepcoinearn', 'kepcoin.userkepcoinspend'],
  [
    'kepcoin_tasks.onetimetask',
    'kepcoin_tasks.useronetimetaskcompletion',
    'kepcoin_tasks.taskcategory',
  ],
  [
    'hackathons.hackathon',
    'hackathons.hackathonproject',
    'hackathons.hackathonregistrant',
    'hackathons.hackathonparticipant',
    'hackathons.hackathonparticipantprojectresult',
  ],
  ['tournaments.tournament', 'tournaments.tournamentstageduel'],
  [
    'tournaments.duel',
    'tournaments.duelplayer',
    'tournaments.duelproblem',
    'tournaments.duelpreset',
    'tournaments.dueltype',
    'tournaments.duelsrating',
  ],
  ['home.kepcovercontest', 'home.kepcovercontestentry', 'home.kepcovercontestvote'],
  ['home.systemupdate', 'home.systemupdatelike'],
  [
    'marketplace.product',
    'marketplace.productvariant',
    'marketplace.marketplaceorder',
    'marketplace.marketplacereview',
    'marketplace.color',
    'marketplace.size',
  ],
  ['blog.blog', 'blog.news', 'blog.blogcomment', 'blog.bloglike', 'blog.topic'],
];

export const relatedRecordResources: Record<string, [string, string, string][]> = {
  'backend.user': [
    ['social_django.usersocialauth', 'user', 'mdi:account-key-outline'],
    ['kepcoin.userkepcoinearn', 'user', 'mdi:cash-plus'],
    ['kepcoin.userkepcoinspend', 'user', 'mdi:cash-minus'],
    ['backend.attempt', 'user', 'mdi:code-tags'],
    ['backend.contestant', 'user', 'mdi:podium'],
    ['achievements.userachievementprogress', 'user', 'mdi:medal-outline'],
    ['daily_tasks.userdailytaskcompletion', 'user', 'mdi:calendar-check-outline'],
    ['kepcoin_tasks.useronetimetaskcompletion', 'user', 'mdi:check-all'],
    ['backend.useractivityhistory', 'user', 'mdi:history'],
  ],
  'backend.contest': [
    ['backend.contestproblem', 'contest', 'mdi:code-tags'],
    ['backend.contestant', 'contest', 'mdi:podium'],
    ['backend.contestregistrant', 'contest', 'mdi:account-plus-outline'],
    ['contests.contestquestion', 'contest', 'mdi:comment-question-outline'],
    ['contests.virtualcontestant', 'contestant__contest', 'mdi:play-circle-outline'],
  ],
  'backend.problem': [
    ['backend.attempt', 'problem', 'mdi:code-braces'],
    ['backend.contestproblem', 'problem', 'mdi:podium'],
    ['problems.problemsolution', 'problem', 'mdi:lightbulb-outline'],
  ],
  'projects.project': [['projects.projectattempt', 'project', 'mdi:folder-check-outline']],
  'testing.test': [['testing.testpassresult', 'test', 'mdi:clipboard-check-outline']],
  'achievements.achievement': [
    ['achievements.userachievementprogress', 'achievement', 'mdi:medal-outline'],
  ],
  'daily_tasks.dailytasks': [['daily_tasks.dailytask', 'daily_tasks', 'mdi:format-list-checks']],
  'kepcoin_tasks.onetimetask': [
    ['kepcoin_tasks.useronetimetaskcompletion', 'task', 'mdi:account-check-outline'],
  ],
  'hackathons.hackathon': [
    ['hackathons.hackathonproject', 'hackathon', 'mdi:laptop'],
    ['hackathons.hackathonregistrant', 'hackathon', 'mdi:account-plus-outline'],
    ['hackathons.hackathonparticipant', 'hackathon', 'mdi:podium'],
  ],
  'home.kepcovercontest': [['home.kepcovercontestentry', 'contest', 'mdi:image-multiple-outline']],
  'marketplace.product': [['marketplace.productvariant', 'product', 'mdi:package-variant']],
};

export function relatedRecordLinks(key: string, id: string, catalog: AdminResource[]) {
  return (relatedRecordResources[key] ?? []).flatMap(([relatedKey, field, icon]) => {
    const resource = catalog.find((item) => item.key === relatedKey);
    if (!resource) return [];
    const search = new URLSearchParams({ ['filter.' + field]: id });
    return [{ resource, icon, to: resource.path + '?' + search.toString() }];
  });
}
