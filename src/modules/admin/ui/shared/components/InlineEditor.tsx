import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { loadAdminInline } from 'modules/admin/application';
import type { AdminInline, AdminInlineRow, AdminOption } from 'modules/admin/domain';
import { inlineRowErrors } from 'modules/admin/domain/utils/inlineValidation';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import { errorText, fieldTitle, resourceTitle } from '../helpers';
import ConsoleCell from './ConsoleCell';
import { ConsoleError } from './ConsoleState';
import EditorFields from './EditorFields';

interface Props {
  resourceKey: string;
  recordId?: string;
  section: AdminInline;
  changes: Record<string, AdminInlineRow>;
  disabled: boolean;
  errors?: unknown;
  files?: Record<string, unknown>;
  onChange: (row: AdminInlineRow) => void;
  onUpload: (name: string, file: File | null) => void;
}

function summary(row: AdminInlineRow, language: string) {
  const title = [
    row.values['title_' + language],
    row.values.title_uz,
    row.values.title,
    row.values.name,
    row.values.symbol,
    row.values.text,
    row.values.organization,
    row.values.company,
  ];
  const text = title.find((value) => typeof value === 'string' && value.trim());
  return text
    ? String(text).replace(/<[^>]+>/g, '')
    : Object.values(row.selectedOptions ?? {})
        .flat()
        .map((option) => option.label)
        .join(' · ') || row.label;
}

export default function InlineEditor({
  resourceKey,
  recordId,
  section,
  changes,
  files = {},
  disabled,
  errors,
  onChange,
  onUpload,
}: Props) {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(section);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [language, setLanguage] = useState(i18n.resolvedLanguage?.slice(0, 2) || 'uz');
  const validation = inlineRowErrors(changes, errors);
  const firstInvalid = Object.keys(validation)[0];
  const invalidLanguage = Object.keys(validation[firstInvalid] ?? {})
    .find((name) => /_(uz|ru|en)$/.test(name))
    ?.slice(-2);
  const simple =
    section.fields.length <= 3 &&
    !section.fields.some(
      (field) =>
        /_(uz|ru|en)$/.test(field.name) ||
        ['richText', 'file', 'image', 'json'].includes(field.kind),
    ) &&
    !section.readonlyFields.length;
  useEffect(() => {
    if (firstInvalid && !simple) setActiveId(firstInvalid);
    if (invalidLanguage) setLanguage(invalidLanguage);
  }, [firstInvalid, errors, simple, invalidLanguage]);
  const visible = [...page.rows, ...Object.values(changes).filter((row) => !row.id)];
  const visibleIds = new Set(visible.map((row) => row.id ?? row.clientId));
  const outside = Object.values(changes).filter(
    (row) => !visibleIds.has(row.id ?? row.clientId) && validation[row.id ?? row.clientId!],
  );
  const rows = [...visible, ...outside].map((row) => changes[row.id ?? row.clientId!] ?? row);
  const active = rows.find((row) => (row.id ?? row.clientId) === activeId);
  const editable = !disabled && (section.permissions.change || section.permissions.add);
  const canEdit = (row: AdminInlineRow) => editable && (!row.id || section.permissions.change);
  const add = () => {
    const values = { ...section.defaultValues };
    for (const name of ['number', 'task_number', 'order'])
      if (section.fields.some((field) => field.name === name)) {
        values[name] =
          Math.max(
            section.total,
            ...rows.filter((row) => !row.delete).map((row) => Number(row.values[name]) || 0),
          ) + 1;
      }
    const row: AdminInlineRow = {
      id: null,
      clientId: crypto.randomUUID(),
      values,
      selectedOptions: section.defaultSelectedOptions,
    };
    onChange(row);
    if (!simple) setActiveId(row.clientId!);
  };
  const changePage = async (value: number) => {
    if (!recordId) return;
    setBusy(true);
    setError(null);
    try {
      const data = await loadAdminInline(resourceKey, recordId, section.prefix, value);
      if (data[0]) setPage(data[0]);
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };
  const fields = (row: AdminInlineRow) => {
    const id = row.id ?? row.clientId!;
    const selectedFiles = Object.fromEntries(
      section.fields.map((field) => [field.name, files[`${section.prefix}.${id}.${field.name}`]]),
    );
    const change = (name: string, value: unknown, selected?: AdminOption[]) =>
      onChange({
        ...row,
        values: { ...row.values, [name]: value },
        selectedOptions: selected
          ? { ...row.selectedOptions, [name]: selected }
          : row.selectedOptions,
      });
    return (
      <EditorFields
        resourceKey={resourceKey}
        recordId={recordId}
        inline={section.prefix}
        pairedTextareas={section.prefix === 'sample_tests'}
        fields={section.fields.filter(
          (field) => !/_(uz|ru|en)$/.test(field.name) || field.name.endsWith('_' + language),
        )}
        values={row.values}
        selectedOptions={row.selectedOptions}
        errors={validation[id]}
        disabled={!canEdit(row)}
        files={selectedFiles}
        onChange={change}
        onUpload={(name, file) => {
          onChange(row);
          onUpload(`${section.prefix}.${id}.${name}`, file);
        }}
      />
    );
  };
  const title = t(`admin.workspace.inlines.${section.prefix}`, {
    defaultValue: resourceTitle(t, { key: section.key, name: section.name }),
  });
  const remove = (row: AdminInlineRow) => (
    <Tooltip title={t(row.delete ? 'admin.console.restore' : 'admin.actions.remove')}>
      <IconButton
        size="small"
        disabled={disabled}
        aria-label={t(row.delete ? 'admin.console.restore' : 'admin.actions.remove')}
        onClick={() => onChange({ ...row, delete: !row.delete })}
      >
        <IconifyIcon icon={row.delete ? 'mdi:undo' : 'mdi:close'} />
      </IconButton>
    </Tooltip>
  );
  return (
    <Box component="section" sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" gap={1.5} mb={2.5}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h2" variant="subtitle1" fontWeight={650}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('admin.workspace.relatedDraftHint')}
          </Typography>
        </Box>
        {section.permissions.add && !disabled && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<IconifyIcon icon="mdi:plus" />}
            onClick={add}
          >
            {t('admin.console.addRow')}
          </Button>
        )}
      </Stack>
      <ConsoleError error={error} />
      {Boolean(errors) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorText(errors)}
        </Alert>
      )}
      {!rows.length && (
        <Stack
          alignItems="center"
          spacing={1.5}
          sx={{ py: 5, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}
        >
          <IconifyIcon icon="mdi:playlist-plus" sx={{ color: 'text.disabled', fontSize: 32 }} />
          <Typography variant="body2" color="text.secondary">
            {t('admin.console.noRows')}
          </Typography>
          {section.permissions.add && !disabled && (
            <Button onClick={add} size="small">
              {t('admin.console.addRow')}
            </Button>
          )}
        </Stack>
      )}
      <Stack gap={simple ? 2 : 0}>
        {rows.map((row, index) => {
          const id = row.id ?? row.clientId!;
          return (
            <Box
              key={id}
              sx={{
                border: simple ? 1 : 0,
                borderBottom: 1,
                borderColor: validation[id] ? 'error.main' : 'divider',
                borderRadius: simple ? 1 : 0,
                p: simple ? 2 : 0,
                py: simple ? 2 : 1.5,
                opacity: row.delete ? 0.5 : 1,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                mb={simple && !row.delete ? 2 : 0}
              >
                <Typography
                  variant="caption"
                  sx={{
                    minWidth: 28,
                    color: 'text.secondary',
                    fontFamily: 'var(--kep-display-font)',
                    fontFeatureSettings: '"ss01" 1',
                  }}
                >
                  {String((page.page - 1) * 30 + index + 1).padStart(2, '0')}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    fontWeight={600}
                    sx={{ textDecoration: row.delete ? 'line-through' : undefined }}
                  >
                    {section.prefix === 'sample_tests'
                      ? t('admin.form.sections.sampleTests')
                      : summary(row, language) || t('admin.console.newRow')}
                  </Typography>
                  {!simple && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {section.fields
                        .slice(0, 3)
                        .filter(
                          (field) => !field.name.endsWith('_ru') && !field.name.endsWith('_en'),
                        )
                        .map((field) => {
                          const value =
                            row.selectedOptions?.[field.name]
                              ?.map((item) => item.label)
                              .join(', ') || row.values[field.name];
                          return typeof value === 'string' || typeof value === 'number'
                            ? `${fieldTitle(t, field)}: ${String(value)
                                .replace(/<[^>]+>/g, '')
                                .slice(0, 60)}`
                            : null;
                        })
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  )}
                </Box>
                {validation[id] && (
                  <IconifyIcon icon="mdi:alert-circle-outline" sx={{ color: 'error.main' }} />
                )}
                {changes[id] && !row.delete && (
                  <Chip
                    size="small"
                    variant="soft"
                    color="warning"
                    label={t('admin.workspace.modified')}
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  />
                )}
                {!simple && !row.delete && (
                  <Button size="small" onClick={() => setActiveId(id)}>
                    {t(canEdit(row) ? 'admin.actions.edit' : 'admin.console.view')}
                  </Button>
                )}
                {(section.permissions.delete || !row.id) && !disabled && remove(row)}
              </Stack>
              {simple && !row.delete && fields(row)}
            </Box>
          );
        })}
      </Stack>
      {page.pagesCount > 1 && (
        <ListPagination
          count={page.pagesCount}
          page={page.page}
          disabled={busy}
          onChange={(value) => void changePage(value)}
        />
      )}
      <Drawer
        anchor="right"
        open={Boolean(active && !active.delete)}
        onClose={() => setActiveId(null)}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-labelledby': `admin-inline-${section.prefix}-title`,
            sx: { width: { xs: '100%', sm: 680 }, maxWidth: '100%' },
          },
        }}
      >
        <DialogHeader
          id={`admin-inline-${section.prefix}-title`}
          title={active ? summary(active, language) || t('admin.console.newRow') : title}
          onClose={() => setActiveId(null)}
        />
        {active && (
          <>
            <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: 'auto' }}>
              <Typography variant="caption" color="text.secondary">
                {title}
              </Typography>
              {section.fields.some((field) => /_(uz|ru|en)$/.test(field.name)) && (
                <Tabs
                  value={language}
                  onChange={(_, value) => setLanguage(value)}
                  aria-label={t('admin.console.contentLanguage')}
                  sx={{ mb: 3 }}
                >
                  {['uz', 'ru', 'en'].map((lang) => (
                    <Tab key={lang} value={lang} label={lang.toUpperCase()} />
                  ))}
                </Tabs>
              )}
              {fields(active)}
              {Object.entries(active.readonly ?? {}).map(([name, cell]) => (
                <Stack key={name} direction="row" justifyContent="space-between" py={1} gap={2}>
                  <Typography color="text.secondary" variant="body2">
                    {fieldTitle(t, { name, label: name.replace(/_/g, ' ') })}
                  </Typography>
                  <ConsoleCell cell={cell} />
                </Stack>
              ))}
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              gap={1.5}
              sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}
            >
              {active.id && section.path && (
                <Button
                  component={Link}
                  to={`${section.path}/${encodeURIComponent(active.id)}`}
                  color="neutral"
                  endIcon={<IconifyIcon icon="mdi:open-in-new" />}
                >
                  {t('admin.workspace.openRecord')}
                </Button>
              )}
              <Box sx={{ flex: 1 }} />
              <Button variant="contained" onClick={() => setActiveId(null)}>
                {t('admin.workspace.done')}
              </Button>
            </Stack>
          </>
        )}
      </Drawer>
    </Box>
  );
}
