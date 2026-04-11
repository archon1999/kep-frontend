import { ChangeEvent, useEffect, useState } from 'react';
import {
  Alert,
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
import {
  fromDateTimeLocal,
  toDateTimeLocal,
  toNumberOrNull,
  toOptionalNumber,
} from 'modules/admin/shared/ui/formUtils';
import RichTextEditor from 'shared/components/form/RichTextEditor';
import { useAdminContest, useAdminContestMeta } from '../../application/queries';
import { contestsAdminClient } from '../../data-access/contestsAdminClient';
import { AdminContestPayload, AdminContestProblem } from '../../domain/types';

const emptyContest: AdminContestPayload = {
  title: '',
  description_uz: '',
  description_en: '',
  description_ru: '',
  start_time: '',
  finish_time: '',
  type: '',
  category: 1,
  participation_type: 1,
  is_rated: true,
  private: false,
  private_link: '',
  problems: [],
};

const languageLabels = [
  { code: 'uz', label: 'Uzbek' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Russian' },
] as const;

const AdminContestFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: contest, isLoading } = useAdminContest(id);
  const { data: meta } = useAdminContestMeta();
  const [form, setForm] = useState<AdminContestPayload>(emptyContest);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contest) {
      setForm({
        ...contest,
        start_time: toDateTimeLocal(contest.start_time),
        finish_time: toDateTimeLocal(contest.finish_time),
      });
    }
  }, [contest]);

  useEffect(() => {
    if (!isEdit && meta && !form.type) {
      setForm((prev) => ({
        ...prev,
        type: meta.types[0]?.value ?? '',
        category: Number(meta.categories[0]?.value ?? prev.category),
        participation_type: Number(meta.participation_types[0]?.value ?? prev.participation_type),
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
      problems: [...prev.problems, { problem_id: 0, symbol: '', ball: 1, delta: null }],
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
      start_time: fromDateTimeLocal(form.start_time),
      finish_time: fromDateTimeLocal(form.finish_time),
      private_link: form.private_link || null,
      problems: form.problems.map((contestProblem) => ({
        ...contestProblem,
        problem_id: Number(contestProblem.problem_id),
        ball: Number(contestProblem.ball),
        delta: toNumberOrNull(contestProblem.delta),
      })),
    }) satisfies AdminContestPayload;

  const handleSave = async () => {
    const payload = buildPayload();

    if (!payload.title || !payload.start_time || !payload.finish_time || !payload.type) {
      setError('Title, type, start time, and finish time are required.');
      return;
    }

    if (payload.problems.some((contestProblem) => !contestProblem.problem_id || !contestProblem.symbol)) {
      setError('Every contest problem needs problem ID and symbol.');
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
    if (!id || !window.confirm(`Delete contest #${id}?`)) {
      return;
    }

    await contestsAdminClient.remove(id);
    navigate(resources.AdminContests);
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
      title={isEdit ? `Edit contest #${id}` : 'Create contest'}
      listPath={resources.AdminContests}
      isEdit={isEdit}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
    >
      <Stack spacing={3}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <AdminFormSection title="Core">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Title" value={form.title} onChange={handleStringField('title')} fullWidth />
            <TextField
              label="Creator ID"
              type="number"
              value={form.creator ?? ''}
              onChange={(event) => setField('creator', toOptionalNumber(event.target.value))}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Start time"
              type="datetime-local"
              value={form.start_time}
              onChange={handleStringField('start_time')}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Finish time"
              type="datetime-local"
              value={form.finish_time}
              onChange={handleStringField('finish_time')}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField select label="Type" value={form.type} onChange={handleStringField('type')} fullWidth>
              {(meta?.types ?? []).map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Category" value={form.category} onChange={handleNumberField('category')} fullWidth>
              {(meta?.categories ?? []).map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Participation"
              value={form.participation_type}
              onChange={handleNumberField('participation_type')}
              fullWidth
            >
              {(meta?.participation_types ?? []).map((participationType) => (
                <MenuItem key={participationType.value} value={participationType.value}>
                  {participationType.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControlLabel
              control={
                <Switch checked={form.is_rated} onChange={(event) => setField('is_rated', event.target.checked)} />
              }
              label="Rated"
            />
            <FormControlLabel
              control={<Switch checked={form.private} onChange={(event) => setField('private', event.target.checked)} />}
              label="Private"
            />
            <TextField label="Private link" value={form.private_link ?? ''} onChange={handleStringField('private_link')} />
          </Stack>
        </AdminFormSection>

        <AdminFormSection title="Descriptions">
          {languageLabels.map((language) => {
            const field = `description_${language.code}` as keyof AdminContestPayload;

            return (
              <RichTextEditor
                key={field}
                value={(form[field] as string | undefined) ?? ''}
                onChange={(value) => setField(field, value as never)}
                placeholder={`${language.label} description`}
                minHeight={220}
              />
            );
          })}
        </AdminFormSection>

        <AdminFormSection title="Contest Problems">
          {form.problems.map((contestProblem, index) => (
            <Stack key={index} direction={{ xs: 'column', lg: 'row' }} spacing={2}>
              <TextField
                label="Problem ID"
                type="number"
                value={contestProblem.problem_id || ''}
                onChange={(event) => updateContestProblem(index, 'problem_id', Number(event.target.value))}
              />
              <TextField
                label="Symbol"
                value={contestProblem.symbol}
                onChange={(event) => updateContestProblem(index, 'symbol', event.target.value)}
              />
              <TextField
                label="Ball"
                type="number"
                value={contestProblem.ball}
                onChange={(event) => updateContestProblem(index, 'ball', Number(event.target.value))}
              />
              <TextField
                label="Delta"
                type="number"
                value={contestProblem.delta ?? ''}
                onChange={(event) => updateContestProblem(index, 'delta', toNumberOrNull(event.target.value))}
              />
              <TextField label="Current title" value={contestProblem.problem_title ?? ''} disabled fullWidth />
              <Button color="error" variant="soft" onClick={() => removeContestProblem(index)}>
                Remove
              </Button>
            </Stack>
          ))}
          <Button variant="soft" onClick={addContestProblem}>
            Add contest problem
          </Button>
        </AdminFormSection>
      </Stack>
    </AdminFormPageLayout>
  );
};

export default AdminContestFormPage;
