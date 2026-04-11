import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import { toNumberOrNull, toOptionalNumber } from 'modules/admin/shared/ui/formUtils';
import RichTextEditor from 'shared/components/form/RichTextEditor';
import { useAdminProblem, useAdminProblemMeta } from '../../application/queries';
import { problemsAdminClient } from '../../data-access/problemsAdminClient';
import { AdminProblemAvailableLanguage, AdminProblemPayload, AdminProblemSampleTest } from '../../domain/types';

const emptyProblem: AdminProblemPayload = {
  title: '',
  title_uz: '',
  title_en: '',
  title_ru: '',
  body_uz: '',
  body_en: '',
  body_ru: '',
  input_data_uz: '',
  input_data_en: '',
  input_data_ru: '',
  output_data_uz: '',
  output_data_en: '',
  output_data_ru: '',
  comment_uz: '',
  comment_en: '',
  comment_ru: '',
  difficulty: 1,
  problem_rating: null,
  time_limit: 1000,
  memory_limit: 256,
  hidden: true,
  partial_solvable: false,
  has_checker: true,
  has_check_input: false,
  sample_tests: [],
  available_languages: [],
  tags: [],
  topics: [],
};

const languageLabels = [
  { code: 'uz', label: 'Uzbek' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Russian' },
] as const;

const translatedRichTextGroups = [
  { prefix: 'body', label: 'Body' },
  { prefix: 'input_data', label: 'Input' },
  { prefix: 'output_data', label: 'Output' },
  { prefix: 'comment', label: 'Comment' },
] as const;

const AdminProblemFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: problem, isLoading } = useAdminProblem(id);
  const { data: meta } = useAdminProblemMeta();
  const [form, setForm] = useState<AdminProblemPayload>(emptyProblem);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problem) {
      setForm(problem);
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

  const updateSampleTest = (
    index: number,
    field: keyof AdminProblemSampleTest,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      sample_tests: prev.sample_tests.map((sampleTest, currentIndex) =>
        currentIndex === index ? { ...sampleTest, [field]: value } : sampleTest,
      ),
    }));
  };

  const addSampleTest = () => {
    setForm((prev) => ({
      ...prev,
      sample_tests: [...prev.sample_tests, { input: '', output: '' }],
    }));
  };

  const removeSampleTest = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sample_tests: prev.sample_tests.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const updateAvailableLanguage = (
    index: number,
    field: keyof AdminProblemAvailableLanguage,
    value: string | number | null,
  ) => {
    setForm((prev) => ({
      ...prev,
      available_languages: prev.available_languages.map((availableLanguage, currentIndex) =>
        currentIndex === index ? { ...availableLanguage, [field]: value } : availableLanguage,
      ),
    }));
  };

  const addAvailableLanguage = () => {
    setForm((prev) => ({
      ...prev,
      available_languages: [
        ...prev.available_languages,
        { lang: meta?.languages[0]?.value ?? 'py', time_limit: null, memory_limit: null, code_template: '', code_golf: null },
      ],
    }));
  };

  const removeAvailableLanguage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      available_languages: prev.available_languages.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const buildPayload = () => {
    const title = form.title || form.title_uz || form.title_en || form.title_ru || '';

    return {
      ...form,
      title,
      author: form.author || undefined,
      problem_rating: toNumberOrNull(form.problem_rating),
      time_limit: toNumberOrNull(form.time_limit),
      memory_limit: toNumberOrNull(form.memory_limit),
      available_languages: form.available_languages.map((availableLanguage) => ({
        ...availableLanguage,
        time_limit: toNumberOrNull(availableLanguage.time_limit),
        memory_limit: toNumberOrNull(availableLanguage.memory_limit),
        code_golf: toNumberOrNull(availableLanguage.code_golf),
      })),
    } satisfies AdminProblemPayload;
  };

  const handleSave = async () => {
    const payload = buildPayload();

    if (!payload.title) {
      setError('Title is required.');
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
    if (!id || !window.confirm(`Delete problem #${id}?`)) {
      return;
    }

    await problemsAdminClient.remove(id);
    navigate(resources.AdminProblems);
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
      title={isEdit ? `Edit problem #${id}` : 'Create problem'}
      listPath={resources.AdminProblems}
      isEdit={isEdit}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
    >
      <Stack spacing={3}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <AdminFormSection title="Core">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Fallback title" value={form.title ?? ''} onChange={handleStringField('title')} fullWidth />
            <TextField
              label="Author ID"
              type="number"
              value={form.author ?? ''}
              onChange={(event) => setField('author', toOptionalNumber(event.target.value))}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              select
              label="Difficulty"
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
              label="Problem rating"
              type="number"
              value={form.problem_rating ?? ''}
              onChange={handleNumberField('problem_rating')}
              fullWidth
            />
            <TextField
              label="Time limit"
              type="number"
              value={form.time_limit ?? ''}
              onChange={handleNumberField('time_limit')}
              fullWidth
            />
            <TextField
              label="Memory limit"
              type="number"
              value={form.memory_limit ?? ''}
              onChange={handleNumberField('memory_limit')}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControlLabel
              control={<Switch checked={form.hidden} onChange={(event) => setField('hidden', event.target.checked)} />}
              label="Hidden"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.partial_solvable}
                  onChange={(event) => setField('partial_solvable', event.target.checked)}
                />
              }
              label="Partial solvable"
            />
            <FormControlLabel
              control={
                <Switch checked={form.has_checker} onChange={(event) => setField('has_checker', event.target.checked)} />
              }
              label="Has checker"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.has_check_input}
                  onChange={(event) => setField('has_check_input', event.target.checked)}
                />
              }
              label="Has check input"
            />
          </Stack>
        </AdminFormSection>

        <AdminFormSection title="Translations">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {languageLabels.map((language) => (
              <TextField
                key={language.code}
                label={`${language.label} title`}
                value={(form[`title_${language.code}`] as string | undefined) ?? ''}
                onChange={(event) => setField(`title_${language.code}` as keyof AdminProblemPayload, event.target.value as never)}
                fullWidth
              />
            ))}
          </Stack>
          {languageLabels.map((language) => (
            <Stack key={language.code} spacing={2}>
              {translatedRichTextGroups.map((group) => {
                const field = `${group.prefix}_${language.code}` as keyof AdminProblemPayload;

                return (
                  <RichTextEditor
                    key={field}
                    value={(form[field] as string | undefined) ?? ''}
                    onChange={(value) => setField(field, value as never)}
                    placeholder={`${language.label} ${group.label.toLowerCase()}`}
                    minHeight={180}
                  />
                );
              })}
            </Stack>
          ))}
        </AdminFormSection>

        <AdminFormSection title="Tags and Topics">
          <Autocomplete
            multiple
            options={meta?.tags ?? []}
            value={selectedTags}
            getOptionLabel={(option) => option.name}
            onChange={(_, value) => setField('tags', value.map((tag) => tag.id))}
            renderInput={(params) => <TextField {...params} label="Tags" />}
          />
          <Autocomplete
            multiple
            options={meta?.topics ?? []}
            value={selectedTopics}
            getOptionLabel={(option) => option.name}
            onChange={(_, value) => setField('topics', value.map((topic) => topic.id))}
            renderInput={(params) => <TextField {...params} label="Topics" />}
          />
        </AdminFormSection>

        <AdminFormSection title="Sample Tests">
          {form.sample_tests.map((sampleTest, index) => (
            <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label={`Input #${index + 1}`}
                value={sampleTest.input}
                onChange={(event) => updateSampleTest(index, 'input', event.target.value)}
                multiline
                minRows={4}
                fullWidth
              />
              <TextField
                label={`Output #${index + 1}`}
                value={sampleTest.output}
                onChange={(event) => updateSampleTest(index, 'output', event.target.value)}
                multiline
                minRows={4}
                fullWidth
              />
              <Button color="error" variant="soft" onClick={() => removeSampleTest(index)}>
                Remove
              </Button>
            </Stack>
          ))}
          <Button variant="soft" onClick={addSampleTest}>
            Add sample test
          </Button>
        </AdminFormSection>

        <AdminFormSection title="Available Languages">
          {form.available_languages.map((availableLanguage, index) => (
            <Stack key={index} direction={{ xs: 'column', lg: 'row' }} spacing={2}>
              <TextField
                select
                label="Language"
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
                label="Time limit"
                type="number"
                value={availableLanguage.time_limit ?? ''}
                onChange={(event) => updateAvailableLanguage(index, 'time_limit', toNumberOrNull(event.target.value))}
              />
              <TextField
                label="Memory limit"
                type="number"
                value={availableLanguage.memory_limit ?? ''}
                onChange={(event) => updateAvailableLanguage(index, 'memory_limit', toNumberOrNull(event.target.value))}
              />
              <TextField
                label="Code golf"
                type="number"
                value={availableLanguage.code_golf ?? ''}
                onChange={(event) => updateAvailableLanguage(index, 'code_golf', toNumberOrNull(event.target.value))}
              />
              <TextField
                label="Code template"
                value={availableLanguage.code_template ?? ''}
                onChange={(event) => updateAvailableLanguage(index, 'code_template', event.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
              <Button color="error" variant="soft" onClick={() => removeAvailableLanguage(index)}>
                Remove
              </Button>
            </Stack>
          ))}
          <Button variant="soft" onClick={addAvailableLanguage}>
            Add language
          </Button>
        </AdminFormSection>
      </Stack>
    </AdminFormPageLayout>
  );
};

export default AdminProblemFormPage;
