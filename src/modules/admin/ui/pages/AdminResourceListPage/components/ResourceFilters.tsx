import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  Collapse,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
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
  const [open, setOpen] = useState(count > 0);
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        gap={1.5}
        sx={{ p: { xs: 2, md: 3 } }}
      >
        <DebouncedTextField
          textFieldComponent={TextField}
          size="small"
          value={query.search ?? ''}
          onValueChange={(value) => onChange('search', value)}
          placeholder={t('admin.searchPlaceholder')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="mdi:magnify" />
                </InputAdornment>
              ),
            },
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
        <TextField
          select
          size="small"
          label={t('admin.console.pageSize')}
          value={query.pageSize ?? 20}
          onChange={(event) => onChange('pageSize', event.target.value)}
          sx={{ width: 105 }}
        >
          {[20, 30, 50].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
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
