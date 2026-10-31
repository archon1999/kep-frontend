import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Collapse, MenuItem, Stack, Tab, Tabs, TextField } from '@mui/material';
import type { AdminList, AdminListQuery } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import SchemaField from '../../../shared/components/SchemaField';
import { fieldTitle } from '../../../shared/helpers';

interface Props {
  resourceKey: string;
  fields: AdminList['filters'];
  query: AdminListQuery;
  onChange: (name: string, value: string) => void;
  onReset: () => void;
}
export default function ResourceFilters({ resourceKey, fields, query, onChange, onReset }: Props) {
  const { t } = useTranslation();
  const selected = query.filters ?? {};
  const count = Object.keys(selected).length + (query.queue ? 1 : 0);
  const [open, setOpen] = useState(false);
  const viewFilter = fields.find((field) =>
    ['hidden', 'in_the_pipeline', 'status', 'is_active'].includes(field.name),
  );
  const views =
    viewFilter?.kind === 'boolean'
      ? [
          {
            value: 'false',
            label: t(
              viewFilter.name === 'is_active'
                ? 'admin.workspace.inactive'
                : viewFilter.name === 'hidden'
                  ? 'admin.workspace.visible'
                  : 'admin.workspace.public',
            ),
          },
          {
            value: 'true',
            label: t(
              viewFilter.name === 'is_active'
                ? 'admin.workspace.active'
                : viewFilter.name === 'hidden'
                  ? 'admin.workspace.hidden'
                  : 'admin.workspace.drafts',
            ),
          },
        ]
      : viewFilter?.choices.length && viewFilter.choices.length <= 6
        ? viewFilter.choices
        : [];
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      {viewFilter && views.length > 0 && (
        <Tabs
          value={String(selected[viewFilter.name] ?? '')}
          onChange={(_, value) => onChange('filter.' + viewFilter.name, value)}
          variant="scrollable"
          aria-label={t('admin.workspace.views')}
          sx={{
            px: { xs: 2, md: 3 },
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 44,
            '& .MuiTab-root': { minHeight: 44, fontSize: 13 },
          }}
        >
          <Tab value="" label={t('admin.console.all')} />
          {views.map((view) => (
            <Tab key={String(view.value)} value={String(view.value)} label={view.label} />
          ))}
        </Tabs>
      )}
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        gap={1.5}
        sx={{ p: { xs: 2, md: 3 } }}
      >
        <DebouncedTextField
          size="small"
          value={query.search ?? ''}
          onValueChange={(value) => onChange('search', value)}
          placeholder={t('admin.searchPlaceholder')}
          slotProps={{
            htmlInput: { 'aria-label': t('admin.searchPlaceholder') },
          }}
          sx={{ minWidth: 150, flex: '1 1 200px' }}
        />
        {fields.length > 0 && (
          <Button
            variant={open ? 'soft' : 'outlined'}
            color="neutral"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            startIcon={<IconifyIcon icon="mdi:tune" />}
          >
            {t('admin.console.filters')}
            {count > 0 ? ` · ${count}` : ''}
          </Button>
        )}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <PageSizeControl
            value={query.pageSize ?? 20}
            onChange={(value) => onChange('pageSize', value)}
          />
        </Box>
      </Stack>
      <Collapse in={open}>
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            pb: 2.5,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          {fields.map((field) =>
            field.kind === 'relation' ? (
              <SchemaField
                key={field.name}
                resourceKey={resourceKey}
                field={{ ...field, required: false, readOnly: false, help: '' }}
                value={selected[field.name] ?? null}
                values={{}}
                filterLookup
                onChange={(value) =>
                  onChange('filter.' + field.name, value == null ? '' : String(value))
                }
              />
            ) : (
              <TextField
                key={field.name}
                select
                size="small"
                value={String(selected[field.name] ?? '')}
                onChange={(event) => onChange('filter.' + field.name, event.target.value)}
                label={fieldTitle(t, field)}
              >
                <MenuItem value="">{t('admin.console.all')}</MenuItem>
                {field.kind === 'boolean'
                  ? [true, false].map((value) => (
                      <MenuItem key={String(value)} value={String(value)}>
                        {t(value ? 'admin.status.yes' : 'admin.status.no')}
                      </MenuItem>
                    ))
                  : field.choices.map((choice) => (
                      <MenuItem key={String(choice.value)} value={String(choice.value)}>
                        {field.kind === 'dateRange'
                          ? t(`admin.console.periods.${choice.value}`, {
                              defaultValue: choice.label,
                            })
                          : choice.label}
                      </MenuItem>
                    ))}
              </TextField>
            ),
          )}
        </Box>
      </Collapse>
      {count > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
          {query.queue && (
            <Chip
              size="small"
              variant="soft"
              label={t(`admin.console.queues.${query.queue}`)}
              onDelete={() => onChange('queue', '')}
            />
          )}
          {Object.entries(selected).map(([name, value]) => {
            const field = fields.find((item) => item.name === name);
            return (
              <Chip
                key={name}
                size="small"
                variant="soft"
                label={`${field ? fieldTitle(t, field) : name}: ${field?.kind === 'boolean' ? t(value === 'true' || value === true ? 'admin.status.yes' : 'admin.status.no') : (field?.choices.find((choice) => String(choice.value) === String(value))?.label ?? value)}`}
                onDelete={() => onChange('filter.' + name, '')}
              />
            );
          })}
          <Button size="small" color="neutral" onClick={onReset}>
            {t('admin.console.resetFilters')}
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export function PageSizeControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <TextField
      select
      size="small"
      label={t('admin.console.pageSize')}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{ width: 105 }}
    >
      {[20, 30, 50].map((size) => (
        <MenuItem key={size} value={size}>
          {size}
        </MenuItem>
      ))}
    </TextField>
  );
}
