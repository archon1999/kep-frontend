import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
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
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { useAdminProblemFormPage } from 'modules/admin/problems/application/hooks/useAdminProblemFormPage';
import { AdminProblemPayload } from 'modules/admin/problems/domain/types';
import type { AdminLanguageCode } from 'modules/admin/shared/domain/language.types';
import AdminDynamicList from 'modules/admin/shared/ui/AdminDynamicList';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import AdminLanguageTabs from 'modules/admin/shared/ui/AdminLanguageTabs';
import { UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import AdminRichTextEditor from 'modules/admin/shared/ui/AdminRichTextEditor';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import { toNumberOrNull } from 'modules/admin/shared/utils/formUtils';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useConfirmationDialog } from 'shared/hooks/useConfirmationDialog';

const translatedRichTextGroups = [
  { prefix: 'body', labelKey: 'body' },
  { prefix: 'inputData', labelKey: 'input' },
  { prefix: 'outputData', labelKey: 'output' },
  { prefix: 'comment', labelKey: 'comment' },
] as const;

const languageFieldSuffix: Record<AdminLanguageCode, 'Uz' | 'En' | 'Ru'> = {
  uz: 'Uz',
  en: 'En',
  ru: 'Ru',
};

const sampleTestTextareaStyles = {
  height: 80,
  maxHeight: 80,
  minHeight: 80,
  overflowY: 'auto',
};

const AdminProblemFormPage = () => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const {
    problem,
    isLoading,
    meta,
    handleSave,
    handleDelete,
    isEdit,
    selectedTags,
    selectedTopics,
    selectedGroups,
    addAvailableLanguage,
    error,
    isSaving,
    pageTitle,
    form,
    setForm,
    selectedAuthor,
    setField,
    handleAuthorChange,
    updateSampleTest,
    addSampleTest,
    removeSampleTest,
    updateAvailableLanguage,
    removeAvailableLanguage,
  } = useAdminProblemFormPage(confirm);

  const { t } = useTranslation();

  const handleNumberField =
    (field: keyof AdminProblemPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: toNumberOrNull(event.target.value) }));
    };

  const handleRequiredNumberField =
    (field: keyof AdminProblemPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: Number(event.target.value) }));
    };

  const renderTranslationFields = (language: AdminLanguageCode) => {
    const titleField = `title${languageFieldSuffix[language]}` as keyof AdminProblemPayload;

    return (
      <Stack spacing={3}>
        <TextField
          label={t('admin.form.fields.localizedTitle', {
            language: t(`admin.form.languages.${language}`),
          })}
          value={(form[titleField] as string | undefined) ?? ''}
          onChange={(event) => setField(titleField, event.target.value as never)}
          fullWidth
        />

        {translatedRichTextGroups.map((group) => {
          const field =
            `${group.prefix}${languageFieldSuffix[language]}` as keyof AdminProblemPayload;

          return (
            <Box key={field}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t(`admin.form.richText.${group.labelKey}`)}
              </Typography>
              <AdminRichTextEditor
                key={`${field}-${(form[field] as string | undefined) ?? ''}`}
                value={(form[field] as string | undefined) ?? ''}
                onChange={(value) => setField(field, value as never)}
                minHeight={180}
                compact
                enableMathJax
                mathJaxPromptText={t('admin.form.prompts.mathJax')}
              />
            </Box>
          );
        })}
      </Stack>
    );
  };

  if (isEdit && isLoading && !problem) {
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
          listPath={resources.AdminProblems}
          isEdit={isEdit}
          isSaving={isSaving}
          onSave={handleSave}
          onDelete={handleDelete}
          sidebarTitle={t('admin.form.sections.problemSettings')}
          sidebar={
            <Stack spacing={2.5}>
              <UsersAutocomplete
                value={selectedAuthor}
                onChange={handleAuthorChange}
                label={t('admin.form.fields.author')}
                placeholder={t('admin.form.placeholders.username')}
              />
              <TextField
                select
                label={t('admin.form.fields.difficulty')}
                value={form.difficulty}
                onChange={handleRequiredNumberField('difficulty')}
                fullWidth
              >
                {(meta?.difficulties ?? []).map((difficulty) => (
                  <MenuItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('admin.form.fields.problemRating')}
                type="number"
                value={form.problemRating ?? ''}
                onChange={handleNumberField('problemRating')}
                fullWidth
              />
              <Stack direction={{ xs: 'column', sm: 'row', lg: 'column' }} spacing={2}>
                <TextField
                  label={t('admin.form.fields.timeLimit')}
                  type="number"
                  value={form.timeLimit ?? ''}
                  onChange={handleNumberField('timeLimit')}
                  fullWidth
                />
                <TextField
                  label={t('admin.form.fields.memoryLimit')}
                  type="number"
                  value={form.memoryLimit ?? ''}
                  onChange={handleNumberField('memoryLimit')}
                  fullWidth
                />
              </Stack>
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.hidden}
                      onChange={(event) => setField('hidden', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.hidden')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.partialSolvable}
                      onChange={(event) => setField('partialSolvable', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.partialSolvable')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.hasChecker}
                      onChange={(event) => setField('hasChecker', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.hasChecker')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.hasCheckInput}
                      onChange={(event) => setField('hasCheckInput', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.hasCheckInput')}
                />
              </Stack>
            </Stack>
          }
        >
          {error ? <Alert severity="error">{error}</Alert> : null}

          <AdminFormSection>
            <AdminLanguageTabs>{renderTranslationFields}</AdminLanguageTabs>
          </AdminFormSection>

          <AdminFormSection title={t('admin.form.sections.tagsTopics')}>
            <Autocomplete
              multiple
              options={meta?.groups ?? []}
              value={selectedGroups}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) =>
                setField(
                  'groups',
                  value.map((group) => group.id),
                )
              }
              renderInput={(params) => (
                <TextField {...params} label={t('admin.form.fields.groups')} />
              )}
            />
            <Autocomplete
              multiple
              options={meta?.tags ?? []}
              value={selectedTags}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) =>
                setField(
                  'tags',
                  value.map((tag) => tag.id),
                )
              }
              renderInput={(params) => (
                <TextField {...params} label={t('admin.form.fields.tags')} />
              )}
            />
            <Autocomplete
              multiple
              options={meta?.topics ?? []}
              value={selectedTopics}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) =>
                setField(
                  'topics',
                  value.map((topic) => topic.id),
                )
              }
              renderInput={(params) => (
                <TextField {...params} label={t('admin.form.fields.topics')} />
              )}
            />
          </AdminFormSection>

          <AdminFormSection title={t('admin.form.sections.sampleTests')}>
            <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.form.fields.input')}</TableCell>
                    <TableCell>{t('admin.form.fields.output')}</TableCell>
                    <TableCell align="right" sx={{ width: 56 }}>
                      {t('admin.actions.remove')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AdminDynamicList
                    items={form.sampleTests}
                    onRemove={removeSampleTest}
                    renderItem={(sampleTest, index, remove) => (
                      <TableRow key={index}>
                        <TableCell sx={{ verticalAlign: 'top' }}>
                          <TextField
                            size="small"
                            label={t('admin.form.fields.input')}
                            value={sampleTest.input}
                            rows={4}
                            onChange={(event) =>
                              updateSampleTest(index, 'input', event.target.value)
                            }
                            multiline
                            slotProps={{
                              htmlInput: {
                                style: {
                                  ...sampleTestTextareaStyles,
                                  resize: 'none',
                                },
                              },
                            }}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'top' }}>
                          <TextField
                            size="small"
                            label={t('admin.form.fields.output')}
                            value={sampleTest.output}
                            rows={4}
                            onChange={(event) =>
                              updateSampleTest(index, 'output', event.target.value)
                            }
                            multiline
                            slotProps={{
                              htmlInput: {
                                style: {
                                  ...sampleTestTextareaStyles,
                                  resize: 'none',
                                },
                              },
                            }}
                            fullWidth
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
            <Button variant="soft" onClick={addSampleTest}>
              {t('admin.actions.addSampleTest')}
            </Button>
          </AdminFormSection>

          <AdminFormSection title={t('admin.form.sections.availableLanguages')}>
            <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.form.fields.language')}</TableCell>
                    <TableCell>{t('admin.form.fields.timeLimit')}</TableCell>
                    <TableCell>{t('admin.form.fields.memoryLimit')}</TableCell>
                    <TableCell>{t('admin.form.fields.codeGolf')}</TableCell>
                    <TableCell>{t('admin.form.fields.codeTemplate')}</TableCell>
                    <TableCell align="right" sx={{ width: 56 }}>
                      {t('admin.actions.remove')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AdminDynamicList
                    items={form.availableLanguages}
                    onRemove={removeAvailableLanguage}
                    renderItem={(availableLanguage, index, remove) => (
                      <TableRow key={index}>
                        <TableCell sx={{ minWidth: 220 }}>
                          <TextField
                            select
                            size="small"
                            label={t('admin.form.fields.language')}
                            value={availableLanguage.lang}
                            onChange={(event) =>
                              updateAvailableLanguage(index, 'lang', event.target.value)
                            }
                            fullWidth
                          >
                            {(meta?.languages ?? []).map((language) => (
                              <MenuItem key={language.value} value={language.value}>
                                {language.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell sx={{ width: 130 }}>
                          <TextField
                            size="small"
                            type="number"
                            label={t('admin.form.fields.timeLimit')}
                            value={availableLanguage.timeLimit ?? ''}
                            onChange={(event) =>
                              updateAvailableLanguage(
                                index,
                                'timeLimit',
                                toNumberOrNull(event.target.value),
                              )
                            }
                            fullWidth
                          />
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <TextField
                            size="small"
                            type="number"
                            label={t('admin.form.fields.memoryLimit')}
                            value={availableLanguage.memoryLimit ?? ''}
                            onChange={(event) =>
                              updateAvailableLanguage(
                                index,
                                'memoryLimit',
                                toNumberOrNull(event.target.value),
                              )
                            }
                            fullWidth
                          />
                        </TableCell>
                        <TableCell sx={{ width: 130 }}>
                          <TextField
                            size="small"
                            type="number"
                            label={t('admin.form.fields.codeGolf')}
                            value={availableLanguage.codeGolf ?? ''}
                            onChange={(event) =>
                              updateAvailableLanguage(
                                index,
                                'codeGolf',
                                toNumberOrNull(event.target.value),
                              )
                            }
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            label={t('admin.form.fields.codeTemplate')}
                            value={availableLanguage.codeTemplate ?? ''}
                            onChange={(event) =>
                              updateAvailableLanguage(index, 'codeTemplate', event.target.value)
                            }
                            multiline
                            minRows={2}
                            fullWidth
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
            <Button variant="soft" onClick={addAvailableLanguage}>
              {t('admin.actions.addLanguage')}
            </Button>
          </AdminFormSection>
        </AdminFormPageLayout>
      }
    </>
  );
};

export default AdminProblemFormPage;
