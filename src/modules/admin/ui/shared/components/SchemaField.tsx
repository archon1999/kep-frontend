import { Suspense, lazy, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useAdminRelation } from 'modules/admin/application';
import type { AdminField, AdminOption, AdminValues } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { errorText, fieldHelp, fieldTitle, formatFieldValue } from '../helpers';

const RichTextEditor = lazy(() => import('shared/components/form/RichTextEditor'));
interface Props {
  filterLookup?: boolean;
  resourceKey: string;
  field: AdminField;
  value: unknown;
  values: AdminValues;
  selected?: AdminOption[];
  recordId?: string;
  inline?: string;
  error?: unknown;
  disabled?: boolean;
  onChange: (value: unknown) => void;
  onUpload?: (file: File | null) => void;
}

function RelationField({
  filterLookup,
  resourceKey,
  field,
  value,
  values,
  selected = [],
  recordId,
  inline,
  error,
  disabled,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [chosen, setChosen] = useState(selected);
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(input), 250);
    return () => window.clearTimeout(timer);
  }, [input]);
  const {
    data,
    isLoading,
    error: lookupError,
  } = useAdminRelation(
    resourceKey,
    { id: recordId, inline, field: field.name, search, values, filter: filterLookup },
    open,
  );
  const options = [
    ...new Map(
      [...chosen, ...selected, ...(data?.options ?? [])].map((option) => [
        String(option.value),
        option,
      ]),
    ).values(),
  ];
  const multiple = field.kind === 'relations';
  const ids = Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];
  const active = ids.map(
    (id) => options.find((option) => String(option.value) === id) ?? { value: id, label: '#' + id },
  );
  return (
    <Autocomplete
      multiple={multiple}
      limitTags={3}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={disabled || field.readOnly}
      options={options}
      filterOptions={(items) => items}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(a, b) => String(a.value) === String(b.value)}
      value={multiple ? active : (active[0] ?? null)}
      loading={isLoading}
      onInputChange={(_, next, reason) => {
        if (reason === 'input' || reason === 'clear') setInput(next);
      }}
      onChange={(_, next) => {
        const items = Array.isArray(next) ? next : next ? [next] : [];
        setChosen(items);
        onChange(multiple ? items.map((item) => item.value) : (items[0]?.value ?? null));
      }}
      noOptionsText={t('admin.console.noResults')}
      loadingText={t('admin.console.loading')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={fieldTitle(t, field)}
          required={field.required && !multiple}
          error={Boolean(error || lookupError)}
          helperText={
            errorText(error) || (lookupError ? t('admin.console.lookupError') : fieldHelp(t, field))
          }
        />
      )}
    />
  );
}

function UploadField({ field, value, disabled, error, onUpload, onChange }: Props) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const id = useId();
  const existing =
    value && typeof value === 'object' ? (value as { name?: string; url?: string }) : null;
  useEffect(() => {
    if (!file || field.kind !== 'image') {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, field.kind]);
  return (
    <Box>
      <Typography component="label" htmlFor={id} variant="body2" fontWeight={600}>
        {fieldTitle(t, field)}
        {field.required ? ' *' : ''}
      </Typography>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        sx={{ mt: 1, p: 2, border: 1, borderColor: error ? 'error.main' : 'divider' }}
      >
        {field.kind === 'image' && (preview || existing?.url) && (
          <Box
            component="img"
            src={preview || existing?.url}
            alt=""
            sx={{ width: 72, height: 72, objectFit: 'contain' }}
          />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap>
            {file?.name || existing?.name?.split('/').slice(-1)[0] || t('admin.console.noFile')}
          </Typography>
          <Stack direction="row" gap={1} mt={0.5}>
            <Button
              component="label"
              size="small"
              disabled={disabled}
              startIcon={<IconifyIcon icon="mdi:upload" />}
            >
              {t('admin.console.chooseFile')}
              <input
                id={id}
                type="file"
                hidden
                accept={field.kind === 'image' ? 'image/*' : undefined}
                onChange={(event) => {
                  const next = event.target.files?.[0];
                  if (next) {
                    setFile(next);
                    onUpload?.(next);
                  }
                }}
              />
            </Button>
            {(file || existing) && !field.required && (
              <Button
                color="error"
                size="small"
                disabled={disabled}
                onClick={() => {
                  setFile(null);
                  onUpload?.(null);
                  onChange(false);
                }}
              >
                {t('admin.actions.remove')}
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
      {(error || field.help) && (
        <FormHelperText error={Boolean(error)}>
          {errorText(error) || fieldHelp(t, field)}
        </FormHelperText>
      )}
    </Box>
  );
}

export default function SchemaField(props: Props) {
  const { t } = useTranslation();
  const labelId = useId();
  const { field, value, error, disabled, onChange } = props;
  const label = fieldTitle(t, field);
  const help =
    errorText(error) ||
    fieldHelp(t, field) ||
    (field.kind === 'duration'
      ? t('admin.console.durationHelp')
      : field.kind === 'array'
        ? t('admin.console.arrayHelp')
        : '');
  const name = field.name;
  const richValue =
    field.format === 'quill' && value && typeof value === 'object'
      ? String((value as { html?: string }).html ?? '')
      : String(value ?? '');
  if (field.kind === 'relation' || field.kind === 'relations') return <RelationField {...props} />;
  if (field.kind === 'file' || field.kind === 'image') return <UploadField {...props} />;
  if (field.kind === 'boolean')
    return (
      <Box sx={{ py: 1 }}>
        <FormControlLabel
          control={
            <Switch
              name={name}
              checked={Boolean(value)}
              onChange={(_, checked) => onChange(checked)}
              disabled={disabled || field.readOnly}
            />
          }
          label={label}
        />
        {help && <FormHelperText error={Boolean(error)}>{help}</FormHelperText>}
      </Box>
    );
  if (field.kind === 'richText')
    return (
      <Box role="group" aria-labelledby={labelId}>
        <Typography id={labelId} variant="body2" fontWeight={600} mb={1}>
          {label}
          {field.required ? ' *' : ''}
        </Typography>
        {disabled || field.readOnly ? (
          <TextField fullWidth multiline minRows={5} value={richValue} disabled />
        ) : (
          <Suspense fallback={<Skeleton variant="rectangular" height={220} />}>
            <RichTextEditor
              value={richValue}
              onChange={field.format === 'quill' ? () => undefined : onChange}
              onDocumentChange={field.format === 'quill' ? onChange : undefined}
              compact
              minHeight={180}
            />
          </Suspense>
        )}
        {help && <FormHelperText error={Boolean(error)}>{help}</FormHelperText>}
      </Box>
    );
  const select = ['select', 'multiselect', 'nullableBoolean'].includes(field.kind);
  const multiple = field.kind === 'multiselect';
  return (
    <TextField
      fullWidth
      name={name}
      label={label}
      required={field.required}
      disabled={disabled || field.readOnly}
      error={Boolean(error)}
      helperText={help}
      type={
        field.kind === 'number'
          ? 'number'
          : field.kind === 'secret'
            ? 'password'
            : field.kind === 'datetime'
              ? 'datetime-local'
              : ['date', 'time'].includes(field.kind)
                ? field.kind
                : 'text'
      }
      multiline={['textarea', 'json', 'array'].includes(field.kind)}
      minRows={field.kind === 'json' ? 5 : 3}
      select={select}
      value={multiple ? (value ?? []) : formatFieldValue(value, field.kind)}
      onChange={(event) =>
        onChange(
          field.kind === 'number'
            ? event.target.value === ''
              ? null
              : Number(event.target.value)
            : field.kind === 'nullableBoolean'
              ? event.target.value === ''
                ? null
                : event.target.value === 'true'
              : event.target.value,
        )
      }
      slotProps={{
        inputLabel: ['datetime', 'date', 'time'].includes(field.kind)
          ? { shrink: true }
          : undefined,
        htmlInput: {
          maxLength: field.maxLength,
          min: field.min,
          max: field.max,
          step: field.kind === 'number' ? 'any' : undefined,
          autoComplete: field.kind === 'secret' ? 'new-password' : undefined,
        },
        select: multiple ? { multiple: true } : undefined,
      }}
    >
      {select && !field.required && <MenuItem value="">—</MenuItem>}
      {field.kind === 'nullableBoolean'
        ? [true, false].map((item) => (
            <MenuItem key={String(item)} value={String(item)}>
              {t(item ? 'admin.status.yes' : 'admin.status.no')}
            </MenuItem>
          ))
        : field.choices?.map((item) => (
            <MenuItem key={String(item.value)} value={String(item.value)}>
              {multiple && (
                <Checkbox
                  checked={Array.isArray(value) && value.map(String).includes(String(item.value))}
                />
              )}
              {field.name === 'usable_password'
                ? t(`admin.console.passwordModes.${item.value}`, { defaultValue: item.label })
                : item.label}
            </MenuItem>
          ))}
    </TextField>
  );
}
