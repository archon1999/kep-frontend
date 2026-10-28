import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { resources } from 'app/routes/resources';
import { useAdminContestFormPage } from 'modules/admin/contests/application/hooks/useAdminContestFormPage';
import { AdminContestPayload } from 'modules/admin/contests/domain/types';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import type { AdminLanguageCode } from 'modules/admin/shared/domain/language.types';
import AdminDynamicList from 'modules/admin/shared/ui/AdminDynamicList';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import AdminLanguageTabs from 'modules/admin/shared/ui/AdminLanguageTabs';
import {
  ProblemsAutocomplete,
  UsersAutocomplete,
} from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import AdminRichTextEditor from 'modules/admin/shared/ui/AdminRichTextEditor';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useConfirmationDialog } from 'shared/hooks/useConfirmationDialog';
import { parseDateTimePickerValue } from 'shared/lib/dateTime';

const languageFieldSuffix: Record<AdminLanguageCode, 'Uz' | 'En' | 'Ru'> = {
  uz: 'Uz',
  en: 'En',
  ru: 'Ru',
};

const buildProblemOption = (id?: number, title?: string): AdminAutocompleteOption | null =>
  id
    ? {
        id,
        title: title || `#${id}`,
      }
    : null;

const AdminContestFormPage = () => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const {
    contest,
    isLoading,
    meta,
    handleSave,
    handleDelete,
    isEdit,
    error,
    isSaving,
    pageTitle,
    form,
    setForm,
    selectedCreator,
    setField,
    handleDateTimeField,
    handleCreatorChange,
    updateContestProblem,
    addContestProblem,
    removeContestProblem,
  } = useAdminContestFormPage(confirm);

  const { t } = useTranslation();

  const handleStringField =
    (field: keyof AdminContestPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleNumberField =
    (field: keyof AdminContestPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: Number(event.target.value) }));
    };

  const parseDateTimeValue = (value?: string) => parseDateTimePickerValue(value);

  const renderDescriptionField = (language: AdminLanguageCode) => {
    const field = `description${languageFieldSuffix[language]}` as keyof AdminContestPayload;
    const fieldValue = (form[field] as string | undefined) ?? '';

    return (
      <Box>
        <AdminRichTextEditor
          key={`${field}-${fieldValue ? 'filled' : 'empty'}`}
          value={fieldValue}
          onChange={(value) => setField(field, value as never)}
          minHeight={260}
          compact
          enableMathJax
          mathJaxPromptText={t('admin.form.prompts.mathJax')}
        />
      </Box>
    );
  };

  if (isEdit && isLoading && !contest) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      {confirmationDialog}
      {
        <AdminFormPageLayout
          title={pageTitle}
          listPath={resources.AdminContests}
          isEdit={isEdit}
          isSaving={isSaving}
          onSave={handleSave}
          onDelete={handleDelete}
          sidebarTitle={t('admin.form.sections.contestSettings')}
          sidebar={
            <Stack spacing={2.5}>
              <TextField
                label={t('admin.form.fields.title')}
                value={form.title}
                onChange={handleStringField('title')}
                fullWidth
              />
              <UsersAutocomplete
                value={selectedCreator}
                onChange={handleCreatorChange}
                label={t('admin.form.fields.creator')}
                placeholder={t('admin.form.placeholders.username')}
              />
              <DateTimePicker
                label={t('admin.form.fields.startTime')}
                value={parseDateTimeValue(form.startTime)}
                onChange={handleDateTimeField('startTime')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    InputLabelProps: { shrink: Boolean(form.startTime) },
                  },
                  popper: { placement: 'bottom-start' },
                }}
              />
              <DateTimePicker
                label={t('admin.form.fields.finishTime')}
                value={parseDateTimeValue(form.finishTime)}
                onChange={handleDateTimeField('finishTime')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    InputLabelProps: { shrink: Boolean(form.finishTime) },
                  },
                  popper: { placement: 'bottom-start' },
                }}
              />
              <TextField
                select
                label={t('admin.form.fields.type')}
                value={form.type}
                onChange={handleStringField('type')}
                fullWidth
              >
                {(meta?.types ?? []).map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={t('admin.form.fields.category')}
                value={form.category}
                onChange={handleNumberField('category')}
                fullWidth
              >
                {(meta?.categories ?? []).map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={t('admin.form.fields.participation')}
                value={form.participationType}
                onChange={handleNumberField('participationType')}
                fullWidth
              >
                {(meta?.participationTypes ?? []).map((participationType) => (
                  <MenuItem key={participationType.value} value={participationType.value}>
                    {participationType.label}
                  </MenuItem>
                ))}
              </TextField>
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isRated}
                      onChange={(event) => setField('isRated', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.rated')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.private}
                      onChange={(event) => setField('private', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.private')}
                />
              </Stack>
              <TextField
                label={t('admin.form.fields.privateLink')}
                value={form.privateLink ?? ''}
                onChange={handleStringField('privateLink')}
                fullWidth
              />
            </Stack>
          }
        >
          {error ? <Alert severity="error">{error}</Alert> : null}

          <AdminFormSection>
            <AdminLanguageTabs>{renderDescriptionField}</AdminLanguageTabs>
          </AdminFormSection>

          <AdminFormSection title={t('admin.form.sections.contestProblems')}>
            <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 320 }}>{t('admin.form.fields.problem')}</TableCell>
                    <TableCell sx={{ minWidth: 130 }}>{t('admin.form.fields.symbol')}</TableCell>
                    <TableCell sx={{ minWidth: 90 }}>{t('admin.form.fields.ball')}</TableCell>
                    <TableCell sx={{ width: 56 }} align="right">
                      {t('admin.actions.remove')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AdminDynamicList
                    items={form.problems}
                    onRemove={removeContestProblem}
                    renderItem={(contestProblem, index, remove) => (
                      <TableRow key={index}>
                        <TableCell>
                          <ProblemsAutocomplete
                            value={buildProblemOption(
                              contestProblem.problemId,
                              contestProblem.problemTitle,
                            )}
                            onChange={(problem) => {
                              updateContestProblem(index, 'problemId', problem?.id ?? 0);
                            }}
                            label={t('admin.form.fields.problem')}
                            textFieldProps={{ size: 'small' }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            label={t('admin.form.fields.symbol')}
                            value={contestProblem.symbol}
                            onChange={(event) =>
                              updateContestProblem(index, 'symbol', event.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            label={t('admin.form.fields.ball')}
                            value={contestProblem.ball}
                            onChange={(event) =>
                              updateContestProblem(index, 'ball', Number(event.target.value))
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => remove(index)}
                            aria-label={t('admin.actions.remove')}
                          >
                            <IconifyIcon
                              icon="material-symbols:delete-outline"
                              width={18}
                              height={18}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="soft" onClick={addContestProblem}>
              {t('admin.actions.addContestProblem')}
            </Button>
          </AdminFormSection>
        </AdminFormPageLayout>
      }
    </>
  );
};

export default AdminContestFormPage;
