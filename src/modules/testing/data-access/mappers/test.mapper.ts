import { Chapter, Question, QuestionOption, QuestionType, Test, TestPass } from '../../domain';
import { FinishTestResponse, PageResult, StartTestResponse, TestResultRow } from '../../domain/ports/testing.repository.ts';

const normalizeOption = (option: any): QuestionOption => ({
  id: option?.id ?? option?.optionId ?? option?.option_id,
  option: option?.option ?? option?.title ?? '',
  optionMain: option?.optionMain ?? option?.option_main ?? option?.option ?? '',
  optionSecondary: option?.optionSecondary ?? option?.option_secondary ?? option?.value ?? '',
  selected: option?.selected ?? false,
});

export const mapQuestion = (question: any): Question => ({
  id: question?.id,
  number: question?.number ?? question?.questionNumber ?? 0,
  type: question?.type as QuestionType,
  text: question?.text ?? question?.title ?? '',
  body: question?.body ?? question?.text_html ?? question?.body_html ?? '',
  audio: question?.audio ?? question?.audio_url ?? '',
  options: (question?.options ?? []).map(normalizeOption),
  input: question?.input ?? '',
  answered: question?.answered ?? false,
  chapter: question?.chapter ? normalizeChapter(question.chapter) : undefined,
});

const normalizeChapter = (chapter: any): Chapter => ({
  id: chapter?.id,
  title: chapter?.title ?? '',
  description: chapter?.description ?? '',
  icon: chapter?.icon ?? '',
});

export const mapTest = (payload: any): Test => ({
  id: payload?.id,
  title: payload?.title ?? '',
  description: payload?.description ?? '',
  duration: payload?.duration ?? payload?.duration_text ?? '',
  chapter: normalizeChapter(payload?.chapter ?? {}),
  questions: (payload?.questions ?? []).map(mapQuestion),
  difficultyTitle: payload?.difficultyTitle ?? payload?.difficulty_title ?? '',
  difficulty: payload?.difficulty ?? 0,
  tags: payload?.tags ?? [],
  userBestResult: payload?.userBestResult ?? payload?.user_best_result,
  questionsCount: payload?.questionsCount ?? payload?.questions_count ?? payload?.questions?.length,
  passesCount: payload?.passesCount ?? payload?.passes_count,
  lastPassed: payload?.lastPassed ?? payload?.last_passed,
  canStart: payload?.canStart ?? payload?.can_start ?? false,
});

export const mapTestPass = (payload: any): TestPass => ({
  id: payload?.id,
  started: payload?.started ?? payload?.started_at ?? '',
  test: mapTest(payload?.test ?? {}),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? payload?.current_page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.results?.length ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.total_pages ?? payload?.pages_count ?? 0,
  data: (payload?.data ?? payload?.results ?? []).map(mapItem),
});

export const mapTestResults = (payload: any): TestResultRow[] =>
  (payload ?? []).map((row: any) => ({
    username: row?.username ?? row?.user ?? '',
    finished: row?.finished ?? row?.finished_at ?? row?.date,
    result: row?.result ?? row?.score,
  }));

export const mapStartTestResponse = (payload: any): StartTestResponse => ({
  success: Boolean(payload?.success ?? payload?.ok ?? payload?.testPassId),
  testPassId: payload?.testPassId ?? payload?.test_pass_id,
});

export const mapFinishTestResponse = (payload: any): FinishTestResponse => ({
  success: Boolean(payload?.success ?? payload?.ok ?? payload?.result),
  result: payload?.result,
});

export const hydrateQuestion = (question: Question): Question => {
  if (question.type === QuestionType.Ordering && question.options?.length) {
    return {
      ...question,
      options: question.options.map((option, index) => ({
        ...option,
        option: option.option || option.optionSecondary || option.optionMain || `#${index + 1}`,
      })),
    };
  }

  return question;
};
