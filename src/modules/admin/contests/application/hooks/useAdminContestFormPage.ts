import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import {
  createAdminContest,
  removeAdminContest,
  updateAdminContest,
} from 'modules/admin/contests/application/mutations';
import { useAdminContest, useAdminContestMeta } from 'modules/admin/contests/application/queries';
import { AdminContestPayload, AdminContestProblem } from 'modules/admin/contests/domain/types';
import { validationMessage } from 'modules/admin/domain/utils/validation';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import { formatAdminEditTitle } from 'modules/admin/shared/utils/editTitle';
import {
  DateTimePickerValue,
  formatDateTimeLocalInputValue,
  formatDateTimePickerValue,
  toBackendUtcDateTime,
} from 'shared/lib/dateTime';

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

const buildUserOption = (id?: number, username?: string): AdminAutocompleteOption | null =>
  id
    ? {
        id,
        username: username || `#${id}`,
      }
    : null;

export const useAdminContestFormPage = (confirm: (message: string) => Promise<boolean>) => {
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
        creatorUsername?: string;
        description_uz?: string;
        description_en?: string;
        description_ru?: string;
      };

      const normalizedDescriptionUz =
        contestAny.descriptionUz || contestAny.description_uz || fallbackDescription;
      const normalizedDescriptionEn =
        contestAny.descriptionEn || contestAny.description_en || fallbackDescription;
      const normalizedDescriptionRu =
        contestAny.descriptionRu || contestAny.description_ru || fallbackDescription;
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
        startTime: formatDateTimeLocalInputValue(contestAny.startTime ?? contestAny.start_time),
        finishTime: formatDateTimeLocalInputValue(contestAny.finishTime ?? contestAny.finish_time),
        participationType: contestAny.participationType ?? contestAny.participation_type,
        privateLink: contestAny.privateLink ?? contestAny.private_link ?? null,
        descriptionUz: normalizedDescriptionUz,
        descriptionEn: normalizedDescriptionEn,
        descriptionRu: normalizedDescriptionRu,
      });
      setSelectedCreator(
        buildUserOption(contest.creator, contestAny.creatorUsername ?? contestAny.creator_username),
      );
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

  const setField = <K extends keyof AdminContestPayload>(
    field: K,
    value: AdminContestPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateTimeField =
    (field: keyof AdminContestPayload) => (value: DateTimePickerValue) => {
      setForm((prev) => ({
        ...prev,
        [field]: formatDateTimePickerValue(value),
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
      startTime: toBackendUtcDateTime(form.startTime),
      finishTime: toBackendUtcDateTime(form.finishTime),
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

    if (
      payload.problems.some((contestProblem) => !contestProblem.problemId || !contestProblem.symbol)
    ) {
      setError(t('admin.form.validation.contestProblemRequiredFields'));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await updateAdminContest(id, payload);
      } else {
        await createAdminContest(payload);
      }
      navigate(resources.AdminContests);
    } catch (caughtError: any) {
      setError(validationMessage(caughtError) || t('admin.console.loadError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !(await confirm(t('admin.contests.confirmDelete', { id })))) {
      return;
    }

    await removeAdminContest(id);
    navigate(resources.AdminContests);
  };

  const pageTitle = isEdit
    ? formatAdminEditTitle(id, contest?.title || form.title)
    : t('admin.contests.createTitle');
  return {
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
  };
};
