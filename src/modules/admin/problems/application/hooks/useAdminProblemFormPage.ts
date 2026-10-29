import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import { validationMessage } from 'modules/admin/domain/utils/validation';
import {
  createAdminProblem,
  removeAdminProblem,
  updateAdminProblem,
} from 'modules/admin/problems/application/mutations';
import { useAdminProblem, useAdminProblemMeta } from 'modules/admin/problems/application/queries';
import {
  AdminProblem,
  AdminProblemAvailableLanguage,
  AdminProblemPayload,
  AdminProblemSampleTest,
} from 'modules/admin/problems/domain/types';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import { formatAdminEditTitle } from 'modules/admin/shared/utils/editTitle';
import { toNumberOrNull } from 'modules/admin/shared/utils/formUtils';

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

const buildUserOption = (id?: number, username?: string): AdminAutocompleteOption | null =>
  id
    ? {
        id,
        username: username || `#${id}`,
      }
    : null;

export const useAdminProblemFormPage = (confirm: (message: string) => Promise<boolean>) => {
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

  const setField = <K extends keyof AdminProblemPayload>(
    field: K,
    value: AdminProblemPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthorChange = (author: AdminAutocompleteOption | null) => {
    setSelectedAuthor(author);
    setField('author', author?.id);
  };

  const updateSampleTest = (index: number, field: keyof AdminProblemSampleTest, value: string) => {
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
      availableLanguages: prev.availableLanguages.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
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
        await updateAdminProblem(id, payload);
      } else {
        await createAdminProblem(payload);
      }
      navigate(resources.AdminProblems);
    } catch (caughtError: any) {
      setError(validationMessage(caughtError) || t('admin.console.loadError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !(await confirm(t('admin.problems.confirmDelete', { id })))) {
      return;
    }

    await removeAdminProblem(id);
    navigate(resources.AdminProblems);
  };

  const pageTitle = isEdit
    ? formatAdminEditTitle(
        id,
        problem?.title || form.title || form.titleUz || form.titleEn || form.titleRu,
      )
    : t('admin.problems.createTitle');
  return {
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
  };
};
