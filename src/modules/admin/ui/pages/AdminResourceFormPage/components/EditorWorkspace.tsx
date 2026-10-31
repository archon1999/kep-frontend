import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { useAdminRecordEditor } from 'modules/admin/application/useAdminRecordEditor';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import ConsoleCell from '../../../shared/components/ConsoleCell';
import EditorFields from '../../../shared/components/EditorFields';
import InlineEditor from '../../../shared/components/InlineEditor';
import PublicationChecks from '../../../shared/components/PublicationChecks';
import { errorData, fieldTitle, getFieldErrors, resourceTitle } from '../../../shared/helpers';
import {
  defaultEditorLanguage,
  editorPresentation,
} from '../../../shared/helpers/resourcePresentation';

export default function EditorWorkspace({
  resourceKey,
  editor,
}: {
  resourceKey: string;
  editor: ReturnType<typeof useAdminRecordEditor>;
}) {
  const { t, i18n } = useTranslation();
  const { record, values, error, saving } = editor;
  const presentation = editorPresentation(record);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));
  const secondaryPrefixes = ['tags', 'topics', 'groups', 'attachments'];
  const mainInlines = record.inlines
    .filter((inline) => !secondaryPrefixes.includes(inline.prefix))
    .sort((a, b) => {
      const order = [
        'sample_tests',
        'problems',
        'questions',
        'tasks',
        'available_languages',
        'available_technologies',
      ];
      return order.indexOf(a.prefix) - order.indexOf(b.prefix);
    });
  const relatedInlines = record.inlines.filter((inline) =>
    secondaryPrefixes.includes(inline.prefix),
  );
  const inlineTab = (prefix: string) =>
    secondaryPrefixes.includes(prefix) ? 'organization' : 'inline:' + prefix;
  const first =
    presentation.groups[0]?.key ??
    (record.inlines.length ? inlineTab(record.inlines[0].prefix) : 'info');
  const [tab, setTab] = useState(first);
  const [visited, setVisited] = useState([first]);
  const [language, setLanguage] = useState(() =>
    defaultEditorLanguage(record, i18n.resolvedLanguage?.slice(0, 2)),
  );
  const [languages, setLanguages] = useState([language]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fieldErrors = getFieldErrors(error);
  const inlineErrors = (errorData(error).inlines ?? {}) as Record<string, unknown>;
  const firstError = Object.keys(fieldErrors)[0];
  const invalidTab =
    presentation.groups.find((group) => group.fields.some((field) => field.name === firstError))
      ?.key ?? (Object.keys(inlineErrors)[0] ? inlineTab(Object.keys(inlineErrors)[0]) : undefined);
  useEffect(() => {
    if (!firstError && !invalidTab) return;
    if (invalidTab) {
      setTab(invalidTab);
      setVisited((current) => (current.includes(invalidTab) ? current : [...current, invalidTab]));
    } else setSettingsOpen(true);
    const suffix = firstError?.match(/_(uz|ru|en)$/)?.[1];
    if (suffix) {
      setLanguage(suffix);
      setLanguages((current) => (current.includes(suffix) ? current : [...current, suffix]));
    }
  }, [error, firstError, invalidTab]);
  const selectTab = (key: string) => {
    setTab(key);
    setVisited((current) => (current.includes(key) ? current : [...current, key]));
  };
  const selectLanguage = (value: string) => {
    setLanguage(value);
    setLanguages((current) => (current.includes(value) ? current : [...current, value]));
  };
  const shared = {
    resourceKey,
    recordId: record.id ?? undefined,
    values,
    disabled: saving || !record.canSave,
    errors: fieldErrors,
    files: editor.files,
    selectedOptions: editor.selectedOptions,
    onChange: editor.setField,
    onUpload: editor.setFile,
  };
  const contentTitle = (key: string) => t(`admin.workspace.sections.${key}`);
  const groupLabel = (key: string) =>
    resourceKey === 'backend.user' && key === 'content'
      ? t('admin.workspace.profile')
      : resourceKey === 'backend.user' && key === 'advanced'
        ? t('admin.workspace.security')
        : key === 'content' && resourceKey === 'backend.problem'
          ? t('admin.workspace.statement')
          : contentTitle(key);
  const activeGroup = presentation.groups.find((group) => group.key === tab);
  const translated = activeGroup?.fields.some((field) => /_(uz|ru|en)$/.test(field.name));
  const hasSide = presentation.side.length > 0 || record.checks?.length > 0;
  return (
    <>
      {Object.keys(fieldErrors).length > 0 && (
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            {t('admin.workspace.fixFields')}
          </Typography>
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {Object.keys(fieldErrors).map((name) => {
              const field = record.fields.find((item) => item.name === name);
              if (!field) return null;
              return (
                <Button
                  key={name}
                  size="small"
                  color="inherit"
                  onClick={() => {
                    const group = presentation.groups.find((item) => item.fields.includes(field));
                    if (group) selectTab(group.key);
                    else setSettingsOpen(true);
                    const lang = name.match(/_(uz|ru|en)$/)?.[1];
                    if (lang) selectLanguage(lang);
                    window.setTimeout(() => {
                      const element = document.querySelector<HTMLElement>(
                        `[data-admin-field="${name}"]`,
                      );
                      element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                      element
                        ?.querySelector<HTMLElement>('input,textarea,[contenteditable="true"]')
                        ?.focus();
                    }, 100);
                  }}
                >
                  {fieldTitle(t, field)}
                </Button>
              );
            })}
          </Stack>
        </Alert>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: hasSide
            ? { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 300px' }
            : 'minmax(0, 1fr)',
          alignItems: 'start',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Tabs
            value={tab}
            onChange={(_, value) => selectTab(value)}
            variant="scrollable"
            allowScrollButtonsMobile
            aria-label={t('admin.workspace.editorSections')}
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 2,
              bgcolor: 'background.default',
              px: { xs: 2, md: 3 },
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { minHeight: 54, minWidth: 0, px: 1.5, fontSize: 13 },
            }}
          >
            {presentation.groups
              .filter((group) => group.key === 'content')
              .map((group) => (
                <Tab
                  key={group.key}
                  value={group.key}
                  iconPosition="start"
                  icon={
                    <IconifyIcon
                      icon={
                        Object.keys(fieldErrors).some((name) =>
                          group.fields.some((field) => field.name === name),
                        )
                          ? 'mdi:alert-circle-outline'
                          : group.icon
                      }
                    />
                  }
                  label={groupLabel(group.key)}
                />
              ))}
            {mainInlines.map((inline) => (
              <Tab
                key={inline.prefix}
                value={'inline:' + inline.prefix}
                iconPosition="start"
                icon={
                  <IconifyIcon
                    icon={
                      inlineErrors[inline.prefix]
                        ? 'mdi:alert-circle-outline'
                        : 'mdi:format-list-bulleted'
                    }
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    {t(`admin.workspace.inlines.${inline.prefix}`, {
                      defaultValue: resourceTitle(t, { key: inline.key, name: inline.name }),
                    })}
                    <Chip
                      size="small"
                      label={
                        inline.total +
                        Object.values(editor.inlines[inline.prefix] ?? {}).filter(
                          (row) => !row.id && !row.delete,
                        ).length -
                        Object.values(editor.inlines[inline.prefix] ?? {}).filter(
                          (row) => row.id && row.delete,
                        ).length
                      }
                      sx={{ height: 20, '& .MuiChip-label': { px: 0.75, fontSize: 11 } }}
                    />
                  </Stack>
                }
              />
            ))}
            {presentation.groups
              .filter((group) => group.key !== 'content')
              .map((group) => (
                <Tab
                  key={group.key}
                  value={group.key}
                  iconPosition="start"
                  icon={
                    <IconifyIcon
                      icon={
                        Object.keys(fieldErrors).some((name) =>
                          group.fields.some((field) => field.name === name),
                        )
                          ? 'mdi:alert-circle-outline'
                          : group.icon
                      }
                    />
                  }
                  label={groupLabel(group.key)}
                />
              ))}
            {relatedInlines.length > 0 && (
              <Tab
                value="organization"
                iconPosition="start"
                icon={<IconifyIcon icon="mdi:tag-multiple-outline" />}
                label={t('admin.workspace.organization')}
              />
            )}
            {Object.keys(record.readonly).length > 0 && (
              <Tab
                value="info"
                label={t('admin.console.recordInfo')}
                icon={<IconifyIcon icon="mdi:information-outline" />}
                iconPosition="start"
              />
            )}
          </Tabs>
          {hasSide && (
            <Button
              onClick={() => setSettingsOpen((value) => !value)}
              fullWidth
              color="neutral"
              startIcon={<IconifyIcon icon="mdi:tune" />}
              endIcon={<IconifyIcon icon={settingsOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} />}
              sx={{
                display: { lg: 'none' },
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                borderRadius: 0,
              }}
            >
              {t('admin.workspace.publicationSettings')}
            </Button>
          )}
          {translated && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              sx={{ px: { xs: 2, md: 3 }, pt: 2 }}
            >
              <Typography variant="caption" color="text.secondary">
                {t('admin.console.contentLanguage')}
              </Typography>
              <Tabs
                value={language}
                onChange={(_, value) => selectLanguage(value)}
                aria-label={t('admin.console.contentLanguage')}
                sx={{
                  minHeight: 34,
                  '& .MuiTab-root': { minHeight: 34, minWidth: 52, p: 1, fontSize: 12 },
                }}
              >
                {['uz', 'ru', 'en'].map((lang) => (
                  <Tab
                    key={lang}
                    value={lang}
                    label={
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        {lang.toUpperCase()}
                        {Object.keys(fieldErrors).some((name) => name.endsWith('_' + lang)) && (
                          <IconifyIcon icon="mdi:alert-circle" color="error.main" />
                        )}
                      </Stack>
                    }
                  />
                ))}
              </Tabs>
            </Stack>
          )}
          {presentation.groups.map(
            (group) =>
              visited.includes(group.key) && (
                <Box
                  key={group.key}
                  role="tabpanel"
                  aria-label={groupLabel(group.key)}
                  hidden={tab !== group.key}
                  sx={{ p: { xs: 2, md: 3 } }}
                >
                  <EditorFields
                    {...shared}
                    fields={group.fields.filter((field) => !/_(uz|ru|en)$/.test(field.name))}
                  />
                  {languages.map((lang) => (
                    <Box
                      key={lang}
                      hidden={language !== lang}
                      sx={{
                        mt: group.fields.some((field) => !/_(uz|ru|en)$/.test(field.name))
                          ? 2.5
                          : 0,
                      }}
                    >
                      <EditorFields
                        {...shared}
                        fields={group.fields.filter((field) => field.name.endsWith('_' + lang))}
                      />
                    </Box>
                  ))}
                </Box>
              ),
          )}
          {record.inlines.map(
            (inline) =>
              visited.includes(inlineTab(inline.prefix)) && (
                <Box
                  key={inline.prefix + record.revision}
                  role="tabpanel"
                  aria-label={resourceTitle(t, { key: inline.key, name: inline.name })}
                  hidden={tab !== inlineTab(inline.prefix)}
                >
                  <InlineEditor
                    resourceKey={resourceKey}
                    recordId={record.id ?? undefined}
                    section={inline}
                    changes={editor.inlines[inline.prefix] ?? {}}
                    files={editor.files}
                    disabled={saving || !record.canSave}
                    errors={inlineErrors[inline.prefix]}
                    onChange={(row) => editor.setInline(inline.prefix, row)}
                    onUpload={editor.setFile}
                  />
                </Box>
              ),
          )}
          {visited.includes('info') && (
            <Box role="tabpanel" hidden={tab !== 'info'} sx={{ p: { xs: 2, md: 3 } }}>
              <Box component="dl" sx={{ m: 0 }}>
                {Object.entries(record.readonly).map(([name, cell]) => (
                  <Stack
                    key={name}
                    direction={{ xs: 'column', sm: 'row' }}
                    gap={1}
                    sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Typography
                      component="dt"
                      variant="body2"
                      color="text.secondary"
                      sx={{ flex: 1 }}
                    >
                      {fieldTitle(t, { name, label: name.replace(/_/g, ' ') })}
                    </Typography>
                    <Box component="dd" sx={{ m: 0, flex: 2, minWidth: 0 }}>
                      <ConsoleCell cell={cell} />
                    </Box>
                  </Stack>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        {hasSide &&
          (desktop ? (
            <Box
              component="aside"
              aria-label={t('admin.workspace.publicationSettings')}
              sx={{ minWidth: 0, borderLeft: '1px solid var(--kep-line)' }}
            >
              <Box sx={{ p: 2.5 }}>
                <Typography component="h2" variant="subtitle2" mb={2.5}>
                  {t('admin.workspace.publicationSettings')}
                </Typography>
                <EditorFields {...shared} fields={presentation.side} singleColumn />
              </Box>
              <PublicationChecks checks={record.checks ?? []} />
            </Box>
          ) : (
            <Drawer
              anchor="right"
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              ModalProps={{ keepMounted: true }}
              slotProps={{
                paper: {
                  role: 'dialog',
                  'aria-labelledby': 'admin-publication-settings',
                  sx: { width: 'min(380px, 100%)' },
                },
              }}
            >
              <DialogHeader
                id="admin-publication-settings"
                title={t('admin.workspace.publicationSettings')}
                onClose={() => setSettingsOpen(false)}
              />
              <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
                <EditorFields {...shared} fields={presentation.side} singleColumn />
                <PublicationChecks checks={record.checks ?? []} />
              </Box>
              <Box sx={{ p: 2, borderTop: '1px solid var(--kep-line)' }}>
                <Button fullWidth variant="contained" onClick={() => setSettingsOpen(false)}>
                  {t('admin.workspace.done')}
                </Button>
              </Box>
            </Drawer>
          ))}
      </Box>
    </>
  );
}
