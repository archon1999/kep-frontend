import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { loadAdminInline } from 'modules/admin/application';
import type { AdminInline, AdminInlineRow } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import { errorText, fieldTitle, resourceTitle } from '../helpers';
import ConsoleCell from './ConsoleCell';
import { ConsoleError } from './ConsoleState';
import SchemaField from './SchemaField';

interface Props {
  resourceKey: string;
  recordId?: string;
  section: AdminInline;
  changes: Record<string, AdminInlineRow>;
  disabled: boolean;
  errors?: unknown;
  onChange: (row: AdminInlineRow) => void;
  onUpload: (name: string, file: File | null) => void;
}
export default function InlineEditor({
  resourceKey,
  recordId,
  section,
  changes,
  disabled,
  errors,
  onChange,
  onUpload,
}: Props) {
  const { t } = useTranslation();
  const [page, setPage] = useState(section);
  const [fresh, setFresh] = useState<AdminInlineRow[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(
    section.rows.length === 1 ? section.rows[0].id! : false,
  );
  const rows = [...page.rows, ...fresh].map((row) => changes[row.id ?? row.clientId!] ?? row);
  const editable = !disabled && (section.permissions.change || section.permissions.add);
  const add = () => {
    const row = {
      id: null,
      clientId: crypto.randomUUID(),
      values: { ...section.defaultValues },
      selectedOptions: section.defaultSelectedOptions,
    };
    setFresh((current) => [...current, row]);
    onChange(row);
    setExpanded(row.clientId);
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
  return (
    <Box component="section" sx={{ borderTop: 1, borderColor: 'divider', p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
        <Typography component="h2" variant="h6" sx={{ flex: 1 }}>
          {resourceTitle(t, { key: section.key, name: section.name })}
        </Typography>
        <Chip size="small" variant="soft" label={section.total + fresh.length} />
        {section.permissions.add && !disabled && (
          <Button size="small" startIcon={<IconifyIcon icon="mdi:plus" />} onClick={add}>
            {t('admin.console.addRow')}
          </Button>
        )}
      </Stack>
      <ConsoleError error={error} />
      {Boolean(errors) && (
        <Typography role="alert" color="error.main" variant="body2" mb={2}>
          {errorText(errors)}
        </Typography>
      )}
      {!rows.length && (
        <Typography color="text.secondary" variant="body2">
          {t('admin.console.noRows')}
        </Typography>
      )}
      {rows.map((row, index) => {
        const id = row.id ?? row.clientId!;
        const deleted = row.delete;
        const summary = Object.entries(row.values).find(
          ([name, value]) =>
            value &&
            ['title', 'name', 'symbol', 'value', 'tag', 'task_number'].some((word) =>
              name.startsWith(word),
            ),
        )?.[1];
        return (
          <Accordion
            key={id}
            expanded={!deleted && expanded === id}
            onChange={(_, open) => setExpanded(open ? id : false)}
            disableGutters
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '0 !important',
              bgcolor: 'transparent',
              '&:before': { display: 'none' },
              mb: 1,
              opacity: deleted ? 0.55 : 1,
            }}
          >
            <AccordionSummary
              expandIcon={deleted ? undefined : <IconifyIcon icon="mdi:chevron-down" />}
            >
              <Stack direction="row" width={1} gap={1.5} alignItems="center">
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{
                    fontFamily: 'var(--kep-display-font)',
                    fontFeatureSettings: '"ss01" 1',
                    minWidth: 25,
                  }}
                >
                  {String((page.page - 1) * 30 + index + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textDecoration: deleted ? 'line-through' : undefined,
                  }}
                >
                  {typeof summary === 'string' || typeof summary === 'number'
                    ? String(summary)
                    : row.id
                      ? row.label || '#' + row.id
                      : t('admin.console.newRow')}
                </Typography>
                {(section.permissions.delete || !row.id) && !disabled && (
                  <IconButton
                    component="span"
                    size="small"
                    role="button"
                    aria-label={t(deleted ? 'admin.console.restore' : 'admin.actions.remove')}
                    onClick={(event) => {
                      event.stopPropagation();
                      onChange({ ...row, delete: !deleted });
                    }}
                  >
                    <IconifyIcon icon={deleted ? 'mdi:undo' : 'mdi:delete-outline'} />
                  </IconButton>
                )}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                {section.fields.map((field) => (
                  <Box
                    key={field.name}
                    sx={{
                      minWidth: 0,
                      gridColumn: [
                        'richText',
                        'textarea',
                        'json',
                        'file',
                        'image',
                        'relations',
                      ].includes(field.kind)
                        ? '1 / -1'
                        : undefined,
                    }}
                  >
                    <SchemaField
                      resourceKey={resourceKey}
                      recordId={recordId}
                      inline={section.prefix}
                      field={field}
                      value={row.values[field.name]}
                      values={row.values}
                      selected={row.selectedOptions?.[field.name]}
                      disabled={!editable || (Boolean(row.id) && !section.permissions.change)}
                      onChange={(value) =>
                        onChange({ ...row, values: { ...row.values, [field.name]: value } })
                      }
                      onUpload={(file) => onUpload(`${section.prefix}.${id}.${field.name}`, file)}
                    />
                  </Box>
                ))}
              </Box>
              {Object.entries(row.readonly ?? {}).map(([name, cell]) => (
                <Stack key={name} direction="row" justifyContent="space-between" py={1} gap={2}>
                  <Typography color="text.secondary" variant="body2">
                    {fieldTitle(t, { name, label: name.replace(/_/g, ' ') })}
                  </Typography>
                  <ConsoleCell cell={cell} />
                </Stack>
              ))}
              {row.id && section.path && (
                <Button
                  component={Link}
                  to={`${section.path}/${encodeURIComponent(row.id)}`}
                  sx={{ mt: 2 }}
                  endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
                >
                  {t('admin.console.view')}
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
      {page.pagesCount > 1 && (
        <ListPagination
          count={page.pagesCount}
          page={page.page}
          disabled={busy}
          onChange={(value) => void changePage(value)}
        />
      )}
    </Box>
  );
}
