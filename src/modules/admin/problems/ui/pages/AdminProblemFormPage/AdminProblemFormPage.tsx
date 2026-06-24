import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  Box,
  Typography,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Switch,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import AdminLanguageTabs, { AdminLanguageCode } from 'modules/admin/shared/ui/AdminLanguageTabs';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import AdminDynamicList from 'modules/admin/shared/ui/AdminDynamicList';
import { formatAdminEditTitle } from 'modules/admin/shared/utils/editTitle';
import { AdminAutocompleteOption, UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import { toNumberOrNull } from 'modules/admin/shared/utils/formUtils';
import AdminRichTextEditor from 'modules/admin/shared/ui/AdminRichTextEditor';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useAdminProblem, useAdminProblemMeta } from 'modules/admin/problems/application/queries';
import { problemsAdminClient } from 'modules/admin/problems/data-access/problemsAdminClient';
import { AdminProblem, AdminProblemAvailableLanguage, AdminProblemPayload, AdminProblemSampleTest } from 'modules/admin/problems/domain/types';

const emptyProblem: AdminProblemPayload = {
  title: '',
  titleUz: '',
  titleEn: '',
  titleRu: '',
  bodyUz: '',
  bodyEn: '',
  bodyRu: '',
  inputDataUz: '',
  inputDataEn: '',
  inputDataRu: '',
  outputDataUz: '',
  outputDataEn: '',
  outputDataRu: '',
  commentUz: '',
  commentEn: '',
  commentRu: '',
  difficulty: 1,
  problemRating: null,
  timeLimit: 1000,
  memoryLimit: 256,
  hidden: true,
  partialSolvable: false,
  hasChecker: true,
  hasCheckInput: false,
  sampleTests: [],
  availableLanguages: [],
  tags: [],
  topics: [],
  groups: [],
};

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

const buildUserOption = (id?: number, username?: string): AdminAutocompleteOption | null =>
  id
    ? {
        id,
        username: username || `#${id}`,
      }
    : null;

const AdminProblemFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: problem, isLoading } = useAdminProblem(id);
  const { data: meta } = useAdminProblemMeta();
  const [form, setForm] = useState<AdminProblemPayload>(emptyProblem);
  const [selectedAuthor, setSelectedAuthor] = useState<AdminAutocompleteOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problem) {
      const problemAny = problem as AdminProblem & {
        title_uz?: string;
        title_en?: string;
        title_ru?: string;
        body_uz?: string;
        body_en?: string;
        body_ru?: string;
        input_data?: string;
        input_data_uz?: string;
        input_data_en?: string;
        input_data_ru?: string;
        output_data?: string;
        output_data_uz?: string;
        output_data_en?: string;
        output_data_ru?: string;
        comment_uz?: string;
        comment_en?: string;
        comment_ru?: string;
      };

      const fallbackTitle = problemAny.title ?? '';
      const fallbackBody = problemAny.body ?? '';
      const fallbackInputData = problemAny.input_data ?? '';
      const fallbackOutputData = problemAny.output_data ?? '';
      const fallbackComment = problemAny.comment ?? '';

      setForm({
        ...emptyProblem,
        ...problem,
        titleUz: problemAny.titleUz ?? problemAny.title_uz ?? fallbackTitle,
        titleEn: problemAny.titleEn ?? problemAny.title_en ?? fallbackTitle,
        titleRu: problemAny.titleRu ?? problemAny.title_ru ?? fallbackTitle,
        bodyUz: problemAny.bodyUz ?? problemAny.body_uz ?? fallbackBody,
        bodyEn: problemAny.bodyEn ?? problemAny.body_en ?? fallbackBody,
        bodyRu: problemAny.bodyRu ?? problemAny.body_ru ?? fallbackBody,
        inputDataUz: problemAny.inputDataUz ?? problemAny.input_data_uz ?? fallbackInputData,
        inputDataEn: problemAny.inputDataEn ?? problemAny.input_data_en ?? fallbackInputData,
        inputDataRu: problemAny.inputDataRu ?? problemAny.input_data_ru ?? fallbackInputData,
        outputDataUz: problemAny.outputDataUz ?? problemAny.output_data_uz ?? fallbackOutputData,
        outputDataEn: problemAny.outputDataEn ?? problemAny.output_data_en ?? fallbackOutputData,
        outputDataRu: problemAny.outputDataRu ?? problemAny.output_data_ru ?? fallbackOutputData,
        commentUz: problemAny.commentUz ?? problemAny.comment_uz ?? fallbackComment,
        commentEn: problemAny.commentEn ?? problemAny.comment_en ?? fallbackComment,
        commentRu: problemAny.commentRu ?? problemAny.comment_ru ?? fallbackComment,
      } satisfies AdminProblemPayload);
      setSelectedAuthor(buildUserOption(problem.author, problem.authorUsername));
    }
  }, [problem]);

  const selectedTags = useMemo(
    () => (meta?.tags ?? []).filter((tag) => form.tags.includes(tag.id)),
    [form.tags, meta?.tags],
  );

  const selectedTopics = useMemo(
    () => (meta?.topics ?? []).filter((topic) => form.topics.includes(topic.id)),
    [form.topics, meta?.topics],
  );

  const selectedGroups = useMemo(
    () => (meta?.groups ?? []).filter((group) => form.groups.includes(group.id)),
    [form.groups, meta?.groups],
  );

  const setField = <K extends keyof AdminProblemPayload>(field: K, value: AdminProblemPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberField =
    (field: keyof AdminProblemPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: toNumberOrNull(event.target.value) }));
    };

  const handleRequiredNumberField =
    (field: keyof AdminProblemPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: Number(event.target.value) }));
    };

  const handleAuthorChange = (author: AdminAutocompleteOption | null) => {
    setSelectedAuthor(author);
    setField('author', author?.id);
  };

  const updateSampleTest = (
    index: number,
    field: keyof AdminProblemSampleTest,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      sampleTests: prev.sampleTests.map((sampleTest, currentIndex) =>
        currentIndex === index ? { ...sampleTest, [field]: value } : sampleTest,
      ),
    }));
  };

  const addSampleTest = () => {
    setForm((prev) => ({
      ...prev,
      sampleTests: [...prev.sampleTests, { input: '', output: '' }],
    }));
  };

  const removeSampleTest = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sampleTests: prev.sampleTests.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const updateAvailableLanguage = (
    index: number,
    field: keyof AdminProblemAvailableLanguage,
    value: string | number | null,
  ) => {
    setForm((prev) => ({
      ...prev,
      availableLanguages: prev.availableLanguages.map((availableLanguage, currentIndex) =>
        currentIndex === index ? { ...availableLanguage, [field]: value } : availableLanguage,
      ),
    }));
  };

  const addAvailableLanguage = () => {
    setForm((prev) => ({
      ...prev,
      availableLanguages: [
        ...prev.availableLanguages,
        {
          lang: meta?.languages[0]?.value ?? 'py',
          timeLimit: null,
          memoryLimit: null,
          codeTemplate: '',
          codeGolf: null,
        },
      ],
    }));
  };

  const removeAvailableLanguage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      availableLanguages: prev.availableLanguages.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const buildPayload = () => {
    const title = form.title || form.titleUz || form.titleEn || form.titleRu || '';

    return {
      ...form,
      title,
      author: form.author || undefined,
      problemRating: toNumberOrNull(form.problemRating),
      timeLimit: toNumberOrNull(form.timeLimit),
      memoryLimit: toNumberOrNull(form.memoryLimit),
      availableLanguages: form.availableLanguages.map((availableLanguage) => ({
        ...availableLanguage,
        timeLimit: toNumberOrNull(availableLanguage.timeLimit),
        memoryLimit: toNumberOrNull(availableLanguage.memoryLimit),
        codeGolf: toNumberOrNull(availableLanguage.codeGolf),
      })),
    } satisfies AdminProblemPayload;
  };

  const handleSave = async () => {
    const payload = buildPayload();

    if (!payload.title) {
      setError(t('admin.form.validation.problemTitleRequired'));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await problemsAdminClient.update(id, payload);
      } else {
        await problemsAdminClient.create(payload);
      }
      navigate(resources.AdminProblems);
    } catch (caughtError: any) {
      setError(JSON.stringify(caughtError?.data ?? caughtError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm(t('admin.problems.confirmDelete', { id }))) {
      return;
    }

    await problemsAdminClient.remove(id);
    navigate(resources.AdminProblems);
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
          const field = `${group.prefix}${languageFieldSuffix[language]}` as keyof AdminProblemPayload;

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

  const pageTitle = isEdit
    ? formatAdminEditTitle(id, problem?.title || form.title || form.titleUz || form.titleEn || form.titleRu)
    : t('admin.problems.createTitle');

  return (
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
              control={<Switch checked={form.hidden} onChange={(event) => setField('hidden', event.target.checked)} />}
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
                <Switch checked={form.hasChecker} onChange={(event) => setField('hasChecker', event.target.checked)} />
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

      <AdminFormSection
      >
        <AdminLanguageTabs>{renderTranslationFields}</AdminLanguageTabs>
      </AdminFormSection>

      <AdminFormSection title={t('admin.form.sections.tagsTopics')}>
        <Autocomplete
          multiple
          options={meta?.groups ?? []}
          value={selectedGroups}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => setField('groups', value.map((group) => group.id))}
          renderInput={(params) => <TextField {...params} label={t('admin.form.fields.groups')} />}
        />
        <Autocomplete
          multiple
          options={meta?.tags ?? []}
          value={selectedTags}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => setField('tags', value.map((tag) => tag.id))}
          renderInput={(params) => <TextField {...params} label={t('admin.form.fields.tags')} />}
        />
        <Autocomplete
          multiple
          options={meta?.topics ?? []}
          value={selectedTopics}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => setField('topics', value.map((topic) => topic.id))}
          renderInput={(params) => <TextField {...params} label={t('admin.form.fields.topics')} />}
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
                        onChange={(event) => updateSampleTest(index, 'input', event.target.value)}
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
                        onChange={(event) => updateSampleTest(index, 'output', event.target.value)}
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
                        <IconifyIcon icon="material-symbols:delete-outline" width={18} height={18} />
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
                        onChange={(event) => updateAvailableLanguage(index, 'lang', event.target.value)}
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
                          updateAvailableLanguage(index, 'timeLimit', toNumberOrNull(event.target.value))
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
                          updateAvailableLanguage(index, 'memoryLimit', toNumberOrNull(event.target.value))
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
                          updateAvailableLanguage(index, 'codeGolf', toNumberOrNull(event.target.value))
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        label={t('admin.form.fields.codeTemplate')}
                        value={availableLanguage.codeTemplate ?? ''}
                        onChange={(event) => updateAvailableLanguage(index, 'codeTemplate', event.target.value)}
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
                        <IconifyIcon icon="material-symbols:delete-outline" width={18} height={18} />
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
  );
};

export default AdminProblemFormPage;
