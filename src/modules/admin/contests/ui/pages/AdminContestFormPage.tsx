import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
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
import {
  AdminAutocompleteOption,
  ProblemsAutocomplete,
  UsersAutocomplete,
} from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import {
  fromDateTimeLocal,
  toDateTimeLocal,
  toNumberOrNull,
} from 'modules/admin/shared/ui/formUtils';
import RichTextEditor from 'shared/components/form/RichTextEditor';
import { useAdminContest, useAdminContestMeta } from '../../application/queries';
import { contestsAdminClient } from '../../data-access/contestsAdminClient';
import { AdminContestPayload, AdminContestProblem } from '../../domain/types';

const emptyContest: AdminContestPayload = {
  title: '',
  descriptionUz: '',
  descriptionEn: '',
  descriptionRu: '',
  startTime: '',
  finishTime: '',
  type: '',
  category: 1,
  participationType: 1,
  isRated: true,
  private: false,
  privateLink: '',
  problems: [],
};

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

const buildProblemOption = (id?: number, title?: string): AdminAutocompleteOption | null =>
  id
    ? {
        id,
        title: title || `#${id}`,
      }
    : null;

const AdminContestFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: contest, isLoading } = useAdminContest(id);
  const { data: meta } = useAdminContestMeta();
  const [form, setForm] = useState<AdminContestPayload>(emptyContest);
  const [selectedCreator, setSelectedCreator] = useState<AdminAutocompleteOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contest) {
      setForm({
        ...contest,
        startTime: toDateTimeLocal(contest.startTime),
        finishTime: toDateTimeLocal(contest.finishTime),
      });
      setSelectedCreator(buildUserOption(contest.creator, contest.creatorUsername));
    }
  }, [contest]);

  useEffect(() => {
    if (!isEdit && meta && !form.type) {
      setForm((prev) => ({
        ...prev,
        type: meta.types[0]?.value ?? '',
        category: Number(meta.categories[0]?.value ?? prev.category),
        participationType: Number(meta.participationTypes[0]?.value ?? prev.participationType),
      }));
    }
  }, [form.type, isEdit, meta]);

  const setField = <K extends keyof AdminContestPayload>(field: K, value: AdminContestPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStringField =
    (field: keyof AdminContestPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleNumberField =
    (field: keyof AdminContestPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: Number(event.target.value) }));
    };

  const handleCreatorChange = (creator: AdminAutocompleteOption | null) => {
    setSelectedCreator(creator);
    setField('creator', creator?.id);
  };

  const updateContestProblem = (
    index: number,
    field: keyof AdminContestProblem,
    value: string | number | null,
  ) => {
    setForm((prev) => ({
      ...prev,
      problems: prev.problems.map((contestProblem, currentIndex) =>
        currentIndex === index ? { ...contestProblem, [field]: value } : contestProblem,
      ),
    }));
  };

  const addContestProblem = () => {
    setForm((prev) => ({
      ...prev,
      problems: [...prev.problems, { problemId: 0, symbol: '', ball: 1, delta: null }],
    }));
  };

  const removeContestProblem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      problems: prev.problems.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const buildPayload = () =>
    ({
      ...form,
      creator: form.creator || undefined,
      startTime: fromDateTimeLocal(form.startTime),
      finishTime: fromDateTimeLocal(form.finishTime),
      privateLink: form.privateLink || null,
      problems: form.problems.map((contestProblem) => ({
        ...contestProblem,
        problemId: Number(contestProblem.problemId),
        ball: Number(contestProblem.ball),
        delta: toNumberOrNull(contestProblem.delta),
      })),
    }) satisfies AdminContestPayload;

  const handleSave = async () => {
    const payload = buildPayload();

    if (!payload.title || !payload.startTime || !payload.finishTime || !payload.type) {
      setError(t('admin.form.validation.contestRequiredFields'));
      return;
    }

    if (payload.problems.some((contestProblem) => !contestProblem.problemId || !contestProblem.symbol)) {
      setError(t('admin.form.validation.contestProblemRequiredFields'));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await contestsAdminClient.update(id, payload);
      } else {
        await contestsAdminClient.create(payload);
      }
      navigate(resources.AdminContests);
    } catch (caughtError: any) {
      setError(JSON.stringify(caughtError?.data ?? caughtError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm(t('admin.contests.confirmDelete', { id }))) {
      return;
    }

    await contestsAdminClient.remove(id);
    navigate(resources.AdminContests);
  };

  const renderDescriptionField = (language: AdminLanguageCode) => {
    const field = `description${languageFieldSuffix[language]}` as keyof AdminContestPayload;

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {t('admin.form.fields.description')}
        </Typography>
        <RichTextEditor
          value={(form[field] as string | undefined) ?? ''}
          onChange={(value) => setField(field, value as never)}
          placeholder={t('admin.form.placeholders.localizedRichText', {
            field: t('admin.form.fields.description').toLowerCase(),
            language: t(`admin.form.languages.${language}`),
          })}
          minHeight={260}
          compact
          enableMathJax
          mathJaxPromptText={t('admin.form.prompts.mathJax')}
          mathJaxPreviewLabel={t('admin.form.fields.mathJaxPreview')}
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
    <AdminFormPageLayout
      title={isEdit ? t('admin.contests.editTitle', { id }) : t('admin.contests.createTitle')}
      listPath={resources.AdminContests}
      isEdit={isEdit}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
      sidebarTitle={t('admin.form.sections.contestSettings')}
      sidebar={
        <Stack spacing={2.5}>
          <TextField label={t('admin.form.fields.title')} value={form.title} onChange={handleStringField('title')} fullWidth />
          <UsersAutocomplete
            value={selectedCreator}
            onChange={handleCreatorChange}
            label={t('admin.form.fields.creator')}
            placeholder={t('admin.form.placeholders.username')}
          />
          <TextField
            label={t('admin.form.fields.startTime')}
            type="datetime-local"
            value={form.startTime}
            onChange={handleStringField('startTime')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            label={t('admin.form.fields.finishTime')}
            type="datetime-local"
            value={form.finishTime}
            onChange={handleStringField('finishTime')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField select label={t('admin.form.fields.type')} value={form.type} onChange={handleStringField('type')} fullWidth>
            {(meta?.types ?? []).map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label={t('admin.form.fields.category')} value={form.category} onChange={handleNumberField('category')} fullWidth>
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
                <Switch checked={form.isRated} onChange={(event) => setField('isRated', event.target.checked)} />
              }
              label={t('admin.form.fields.rated')}
            />
            <FormControlLabel
              control={<Switch checked={form.private} onChange={(event) => setField('private', event.target.checked)} />}
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

      <AdminFormSection
        title={t('admin.form.sections.descriptions')}
        subheader={t('admin.form.subheaders.contestDescriptions')}
      >
        <AdminLanguageTabs>{renderDescriptionField}</AdminLanguageTabs>
      </AdminFormSection>

      <AdminFormSection title={t('admin.form.sections.contestProblems')}>
        {form.problems.map((contestProblem, index) => (
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
                  {t('admin.form.fields.contestProblemNumber', { count: index + 1 })}
                </Typography>
                <Button color="error" variant="soft" onClick={() => removeContestProblem(index)}>
                  {t('admin.actions.remove')}
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                <ProblemsAutocomplete
                  value={buildProblemOption(contestProblem.problemId, contestProblem.problemTitle)}
                  onChange={(problem) => {
                    updateContestProblem(index, 'problemId', problem?.id ?? 0);
                    updateContestProblem(index, 'problemTitle', problem?.title ?? null);
                  }}
                  label={t('admin.form.fields.problem')}
                />
                <TextField
                  label={t('admin.form.fields.symbol')}
                  value={contestProblem.symbol}
                  onChange={(event) => updateContestProblem(index, 'symbol', event.target.value)}
                />
                <TextField
                  label={t('admin.form.fields.ball')}
                  type="number"
                  value={contestProblem.ball}
                  onChange={(event) => updateContestProblem(index, 'ball', Number(event.target.value))}
                />
                <TextField
                  label={t('admin.form.fields.delta')}
                  type="number"
                  value={contestProblem.delta ?? ''}
                  onChange={(event) => updateContestProblem(index, 'delta', toNumberOrNull(event.target.value))}
                />
              </Stack>
              <TextField
                label={t('admin.form.fields.currentTitle')}
                value={contestProblem.problemTitle ?? ''}
                disabled
                fullWidth
              />
            </Stack>
          </Box>
        ))}
        <Button variant="soft" onClick={addContestProblem}>
          {t('admin.actions.addContestProblem')}
        </Button>
      </AdminFormSection>
    </AdminFormPageLayout>
  );
};

export default AdminContestFormPage;
