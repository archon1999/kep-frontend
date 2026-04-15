import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import AdminLanguageTabs, { AdminLanguageCode } from 'modules/admin/shared/ui/AdminLanguageTabs';
import { AdminAutocompleteOption, UsersAutocomplete } from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import { toNumberOrNull } from 'modules/admin/shared/ui/formUtils';
import RichTextEditor from 'shared/components/form/RichTextEditor';
import { useAdminProblem, useAdminProblemMeta } from '../../application/queries';
import { problemsAdminClient } from '../../data-access/problemsAdminClient';
import { AdminProblemAvailableLanguage, AdminProblemPayload, AdminProblemSampleTest } from '../../domain/types';

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
      setForm(problem);
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

  const setField = <K extends keyof AdminProblemPayload>(field: K, value: AdminProblemPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStringField =
    (field: keyof AdminProblemPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
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
              <RichTextEditor
                value={(form[field] as string | undefined) ?? ''}
                onChange={(value) => setField(field, value as never)}
                placeholder={t('admin.form.placeholders.localizedRichText', {
                  field: t(`admin.form.richText.${group.labelKey}`).toLowerCase(),
                  language: t(`admin.form.languages.${language}`),
                })}
                minHeight={180}
                compact
                enableMathJax
                mathJaxPromptText={t('admin.form.prompts.mathJax')}
                mathJaxPreviewLabel={t('admin.form.fields.mathJaxPreview')}
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
    <AdminFormPageLayout
      title={isEdit ? t('admin.problems.editTitle', { id }) : t('admin.problems.createTitle')}
      listPath={resources.AdminProblems}
      isEdit={isEdit}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
      sidebarTitle={t('admin.form.sections.problemSettings')}
      sidebar={
        <Stack spacing={2.5}>
          <TextField
            label={t('admin.form.fields.fallbackTitle')}
            value={form.title ?? ''}
            onChange={handleStringField('title')}
            fullWidth
          />
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
        title={t('admin.form.sections.translations')}
        subheader={t('admin.form.subheaders.problemTranslations')}
      >
        <AdminLanguageTabs>{renderTranslationFields}</AdminLanguageTabs>
      </AdminFormSection>

      <AdminFormSection title={t('admin.form.sections.tagsTopics')}>
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
        {form.sampleTests.map((sampleTest, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle2">
                  {t('admin.form.fields.sampleTestNumber', { count: index + 1 })}
                </Typography>
                <Button color="error" variant="soft" onClick={() => removeSampleTest(index)}>
                  {t('admin.actions.remove')}
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('admin.form.fields.input')}
                  value={sampleTest.input}
                  onChange={(event) => updateSampleTest(index, 'input', event.target.value)}
                  multiline
                  minRows={4}
                  fullWidth
                />
                <TextField
                  label={t('admin.form.fields.output')}
                  value={sampleTest.output}
                  onChange={(event) => updateSampleTest(index, 'output', event.target.value)}
                  multiline
                  minRows={4}
                  fullWidth
                />
              </Stack>
            </Stack>
          </Box>
        ))}
        <Button variant="soft" onClick={addSampleTest}>
          {t('admin.actions.addSampleTest')}
        </Button>
      </AdminFormSection>

      <AdminFormSection title={t('admin.form.sections.availableLanguages')}>
        {form.availableLanguages.map((availableLanguage, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle2">
                  {t('admin.form.fields.languageNumber', { count: index + 1 })}
                </Typography>
                <Button color="error" variant="soft" onClick={() => removeAvailableLanguage(index)}>
                  {t('admin.actions.remove')}
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                <TextField
                  select
                  label={t('admin.form.fields.language')}
                  value={availableLanguage.lang}
                  onChange={(event) => updateAvailableLanguage(index, 'lang', event.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {(meta?.languages ?? []).map((language) => (
                    <MenuItem key={language.value} value={language.value}>
                      {language.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={t('admin.form.fields.timeLimit')}
                  type="number"
                  value={availableLanguage.timeLimit ?? ''}
                  onChange={(event) => updateAvailableLanguage(index, 'timeLimit', toNumberOrNull(event.target.value))}
                />
                <TextField
                  label={t('admin.form.fields.memoryLimit')}
                  type="number"
                  value={availableLanguage.memoryLimit ?? ''}
                  onChange={(event) => updateAvailableLanguage(index, 'memoryLimit', toNumberOrNull(event.target.value))}
                />
                <TextField
                  label={t('admin.form.fields.codeGolf')}
                  type="number"
                  value={availableLanguage.codeGolf ?? ''}
                  onChange={(event) => updateAvailableLanguage(index, 'codeGolf', toNumberOrNull(event.target.value))}
                />
              </Stack>
              <TextField
                label={t('admin.form.fields.codeTemplate')}
                value={availableLanguage.codeTemplate ?? ''}
                onChange={(event) => updateAvailableLanguage(index, 'codeTemplate', event.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
            </Stack>
          </Box>
        ))}
        <Button variant="soft" onClick={addAvailableLanguage}>
          {t('admin.actions.addLanguage')}
        </Button>
      </AdminFormSection>
    </AdminFormPageLayout>
  );
};

export default AdminProblemFormPage;
