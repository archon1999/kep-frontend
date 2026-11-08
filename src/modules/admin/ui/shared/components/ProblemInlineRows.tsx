import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Collapse, FormHelperText, Stack, Typography } from '@mui/material';
import type { AdminField, AdminInline, AdminInlineRow, AdminOption } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { errorText } from '../helpers';
import CodeTemplateDialog from './CodeTemplateDialog';
import ConsoleCell from './ConsoleCell';
import SchemaField from './SchemaField';

export default function ProblemInlineRows({
  section,
  rows,
  recordId,
  files,
  validation,
  canEdit,
  onChange,
  onUpload,
  remove,
}: {
  section: AdminInline;
  rows: AdminInlineRow[];
  recordId?: string;
  files: Record<string, unknown>;
  validation: Record<string, Record<string, unknown>>;
  canEdit: (row: AdminInlineRow) => boolean;
  onChange: (row: AdminInlineRow) => void;
  onUpload: (name: string, file: File | null) => void;
  remove: (row: AdminInlineRow) => ReactNode;
}) {
  const { t } = useTranslation();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string[]>([]);
  const languages = section.prefix === 'available_languages';
  const attachments = section.prefix === 'attachments';
  const invalidTemplate = rows.find((row) => {
    const errors = validation[row.id ?? row.clientId!];
    return errors?.code_template || errors?.code_golf;
  });
  const invalidTemplateId = invalidTemplate?.id ?? invalidTemplate?.clientId;
  useEffect(() => {
    if (invalidTemplateId) setTemplateId(invalidTemplateId);
  }, [invalidTemplateId]);
  const active = rows.find((row) => (row.id ?? row.clientId) === templateId && !row.delete);
  const languageName = (row: AdminInlineRow) =>
    section.fields
      .find((field) => field.name === 'lang')
      ?.choices?.find((option) => option.value === row.values.lang)?.label ||
    String(row.values.lang || '—');
  return (
    <Stack>
      {rows.map((row) => {
        const id = row.id ?? row.clientId!;
        const errors = validation[id] ?? {};
        const primary = section.fields.filter((field) =>
          languages
            ? ['lang', 'time_limit', 'memory_limit'].includes(field.name)
            : attachments
              ? ['name', 'file'].includes(field.name)
              : true,
        );
        const secondary = section.fields.filter(
          (field) =>
            !primary.includes(field) && !['code_template', 'code_golf'].includes(field.name),
        );
        const change = (name: string, value: unknown, selected?: AdminOption[]) =>
          onChange({
            ...row,
            values: { ...row.values, [name]: value },
            selectedOptions: selected
              ? { ...row.selectedOptions, [name]: selected }
              : row.selectedOptions,
          });
        const field = (descriptor: AdminField) => (
          <SchemaField
            key={descriptor.name}
            resourceKey="backend.problem"
            recordId={recordId}
            inline={section.prefix}
            field={descriptor}
            value={row.values[descriptor.name]}
            values={row.values}
            selected={row.selectedOptions?.[descriptor.name]}
            error={errors[descriptor.name]}
            disabled={!canEdit(row)}
            suffix={
              descriptor.name === 'time_limit'
                ? t('admin.workspace.milliseconds')
                : descriptor.name === 'memory_limit'
                  ? t('admin.workspace.megabytes')
                  : undefined
            }
            placeholder={
              languages && ['time_limit', 'memory_limit'].includes(descriptor.name)
                ? t('admin.workspace.inheritLimit')
                : undefined
            }
            pendingFile={
              files[`${section.prefix}.${id}.${descriptor.name}`] instanceof File
                ? (files[`${section.prefix}.${id}.${descriptor.name}`] as File)
                : undefined
            }
            onChange={(value, selected) => change(descriptor.name, value, selected)}
            onUpload={(file) => {
              onChange(row);
              onUpload(`${section.prefix}.${id}.${descriptor.name}`, file);
            }}
          />
        );
        return (
          <Box
            key={id}
            data-admin-inline-row={id}
            sx={{
              py: 2,
              borderBottom: 1,
              borderColor: Object.keys(errors).length ? 'error.main' : 'divider',
              opacity: row.delete ? 0.5 : 1,
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr) auto',
                  md: languages
                    ? 'minmax(150px, 1.3fr) repeat(2, minmax(110px, .9fr)) 158px 32px'
                    : attachments
                      ? 'minmax(120px, .8fr) minmax(200px, 1.4fr) auto'
                      : `repeat(${primary.length}, minmax(0, 1fr)) auto`,
                },
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              {row.delete ? (
                <Typography
                  variant="body2"
                  sx={{ gridColumn: '1 / -2', textDecoration: 'line-through' }}
                >
                  {languages
                    ? languageName(row)
                    : row.selectedOptions?.tag?.[0]?.label ||
                      (row.values.name as string) ||
                      t('admin.console.newRow')}
                </Typography>
              ) : (
                primary.map((descriptor) => (
                  <Box
                    key={descriptor.name}
                    data-admin-field={descriptor.name}
                    sx={{ minWidth: 0, gridColumn: { xs: '1', md: 'auto' } }}
                  >
                    {field(descriptor)}
                  </Box>
                ))
              )}
              {!row.delete && languages && (
                <Box sx={{ gridColumn: { xs: '1', md: 'auto' } }}>
                  <Button
                    size="small"
                    color={row.values.code_template ? 'primary' : 'neutral'}
                    startIcon={<IconifyIcon icon="mdi:code-braces" />}
                    onClick={() => setTemplateId(id)}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {t('admin.console.fields.code_template')}
                    {row.values.code_template ? ' ✓' : ''}
                  </Button>
                  {Boolean(errors.code_template || errors.code_golf) && (
                    <FormHelperText error>
                      {errorText(errors.code_template || errors.code_golf)}
                    </FormHelperText>
                  )}
                </Box>
              )}
              <Box
                sx={{
                  gridColumn: { xs: '2', md: '-2 / -1' },
                  gridRow: { xs: '1', md: 'auto' },
                  alignSelf: 'center',
                }}
              >
                {remove(row)}
              </Box>
            </Box>
            {!row.delete && secondary.length > 0 && (
              <>
                <Button
                  size="small"
                  color="neutral"
                  onClick={() =>
                    setExpanded((current) =>
                      current.includes(id)
                        ? current.filter((value) => value !== id)
                        : [...current, id],
                    )
                  }
                  endIcon={
                    <IconifyIcon
                      icon={expanded.includes(id) ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                    />
                  }
                  sx={{ mt: 1 }}
                >
                  {t('admin.workspace.sections.details')}
                </Button>
                <Collapse
                  in={
                    expanded.includes(id) || secondary.some((descriptor) => errors[descriptor.name])
                  }
                >
                  <Stack gap={2} sx={{ mt: 1.5 }}>
                    {secondary.map(field)}
                  </Stack>
                </Collapse>
              </>
            )}
            {!row.delete && Object.keys(row.readonly ?? {}).length > 0 && (
              <Stack direction="row" gap={2} flexWrap="wrap" sx={{ mt: 1 }}>
                {Object.entries(row.readonly ?? {}).map(([name, value]) => (
                  <ConsoleCell key={name} name={name} cell={value} />
                ))}
              </Stack>
            )}
          </Box>
        );
      })}
      {active && (
        <CodeTemplateDialog
          key={templateId}
          row={active}
          languageName={languageName(active)}
          extraField={section.fields.find((field) => field.name === 'code_golf')}
          disabled={!canEdit(active)}
          errors={validation[active.id ?? active.clientId!]}
          onClose={() => setTemplateId(null)}
          onApply={(values) => onChange({ ...active, values: { ...active.values, ...values } })}
        />
      )}
    </Stack>
  );
}
