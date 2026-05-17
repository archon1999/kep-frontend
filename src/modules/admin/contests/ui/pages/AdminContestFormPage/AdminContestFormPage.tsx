import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Box,
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
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import AdminLanguageTabs, { AdminLanguageCode } from 'modules/admin/shared/ui/AdminLanguageTabs';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import { formatAdminEditTitle } from 'modules/admin/shared/utils/editTitle';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AdminDynamicList from 'modules/admin/shared/ui/AdminDynamicList';
import {
  AdminAutocompleteOption,
  ProblemsAutocomplete,
  UsersAutocomplete,
} from 'modules/admin/shared/ui/AdminResourceAutocomplete';
import {
  fromDateTimeLocal,
  toDateTimeLocal,
} from 'modules/admin/shared/utils/formUtils';
import AdminRichTextEditor from 'modules/admin/shared/ui/AdminRichTextEditor';
import { useAdminContest, useAdminContestMeta } from 'modules/admin/contests/application/queries';
import { contestsAdminClient } from 'modules/admin/contests/data-access/contestsAdminClient';
import { AdminContestPayload, AdminContestProblem } from 'modules/admin/contests/domain/types';
import dayjs from 'dayjs';

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
      const fallbackDescription =
        contest.description ??
        (contest as any).description_uz ??
        (contest as any).description_en ??
        (contest as any).description_ru ??
        (contest as any).descriptionUz ??
        (contest as any).descriptionEn ??
        (contest as any).descriptionRu ??
        '';
      const contestAny = contest as AdminContestPayload & {
        start_time?: string;
        finish_time?: string;
        participation_type?: number;
        creator_username?: string;
        private_link?: string | null;
        logo_url?: string | null;
        og_image_url?: string | null;
        description_uz?: string;
        description_en?: string;
        description_ru?: string;
      };

      const normalizedDescriptionUz =
        contestAny.descriptionUz ||
        contestAny.description_uz ||
        fallbackDescription;
      const normalizedDescriptionEn =
        contestAny.descriptionEn ||
        contestAny.description_en ||
        fallbackDescription;
      const normalizedDescriptionRu =
        contestAny.descriptionRu ||
        contestAny.description_ru ||
        fallbackDescription;
      const normalizedProblems = contest.problems.map((contestProblem) => {
        const contestProblemAny = contestProblem as AdminContestProblem & {
          problem_id?: number;
          problem_title?: string;
        };

        return {
          ...contestProblemAny,
          problemId: Number(contestProblemAny.problemId ?? contestProblemAny.problem_id ?? 0),
          problemTitle: contestProblemAny.problemTitle ?? contestProblemAny.problem_title,
          symbol: contestProblemAny.symbol,
          ball: contestProblemAny.ball,
        };
      });

      setForm({
        ...emptyContest,
        ...contest,
        problems: normalizedProblems,
        startTime: toDateTimeLocal(contestAny.startTime ?? contestAny.start_time),
        finishTime: toDateTimeLocal(contestAny.finishTime ?? contestAny.finish_time),
        participationType: contestAny.participationType ?? contestAny.participation_type,
        privateLink: contestAny.privateLink ?? contestAny.private_link ?? null,
        descriptionUz: normalizedDescriptionUz,
        descriptionEn: normalizedDescriptionEn,
        descriptionRu: normalizedDescriptionRu,
      });
      setSelectedCreator(buildUserOption(contest.creator, contestAny.creatorUsername ?? contestAny.creator_username));
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

  const parseDateTimeValue = (value?: string) => {
    if (!value) {
      return null;
    }

    const parsed = dayjs(value);

    return parsed.isValid() ? parsed : null;
  };

  const handleDateTimeField = (field: keyof AdminContestPayload) => (value: dayjs.Dayjs | null) => {
    setForm((prev) => ({
      ...prev,
      [field]: value ? value.format('YYYY-MM-DDTHH:mm') : '',
    }));
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
      problems: [...prev.problems, { problemId: 0, symbol: '', ball: 1 }],
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
        problemId: Number(contestProblem.problemId),
        symbol: contestProblem.symbol,
        ball: Number(contestProblem.ball),
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

  const pageTitle = isEdit
    ? formatAdminEditTitle(id, contest?.title || form.title)
    : t('admin.contests.createTitle');

  return (
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
          <TextField label={t('admin.form.fields.title')} value={form.title} onChange={handleStringField('title')} fullWidth />
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
                        value={buildProblemOption(contestProblem.problemId, contestProblem.problemTitle)}
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
                        onChange={(event) => updateContestProblem(index, 'symbol', event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        label={t('admin.form.fields.ball')}
                        value={contestProblem.ball}
                        onChange={(event) => updateContestProblem(index, 'ball', Number(event.target.value))}
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
        <Button variant="soft" onClick={addContestProblem}>
          {t('admin.actions.addContestProblem')}
        </Button>
      </AdminFormSection>
    </AdminFormPageLayout>
  );
};

export default AdminContestFormPage;
