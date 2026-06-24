import {
  CategoryTag,
  ProblemList,
  ProblemsCategory,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  AttemptDetail,
  AttemptFilterOption,
  AttemptJudgeSummary,
  AttemptJudgeSummaryCase,
  AttemptJudgeSummaryGroup,
  AttemptJudgeSummarySubtask,
  AttemptListItem,
  DifficultyBreakdown,
  PeriodRatingEntry,
  ProblemAttemptStatistic,
  ProblemAttemptSummary,
  ProblemAttachment,
  ProblemAttemptsForSolveStatistic,
  ProblemAvailableLanguage,
  ProblemCategory,
  ProblemDetail,
  ProblemGroup,
  ProblemLanguageOption,
  ProblemLanguageStatistic,
  ProblemListItem,
  ProblemSampleTest,
  ProblemSolution,
  ProblemSolver,
  ProblemStatistics,
  ProblemTag,
  ProblemTopAttempt,
  ProblemTopic,
  ProblemUserInfo,
  ProblemUserSummary,
  ProblemVoteResult,
  ProblemsRatingHistoryEntry,
  ProblemsRatingRow,
  ProblemsRatingSummary,
  ProblemsUserStatistics,
  ProblemsUserStatisticsActivity,
  ProblemsUserStatisticsHeatmap,
  RecommendationFilterPatch,
  RecommendationProfile,
  RecommendationProgress,
  RecommendationQuestion,
  RecommendationQuestionOption,
  RecommendationResolveResponse,
  RecommendationResultOption,
  SimilarProblem,
  StudyPlanDay,
  StudyPlanDayProblem,
  StudyPlanDetail,
  StudyPlanListItem,
} from '../../domain/entities/problem.entity.ts';
import { PageResult } from '../../domain/ports/problems.repository.ts';

const toNumber = (value: unknown) => (typeof value === 'number' ? value : Number(value) || 0);
const toNullableNumber = (value: any) =>
  value === null || value === undefined || value === '' ? undefined : toNumber(value);
const toOptionalBoolean = (value: any) =>
  value === undefined || value === null ? undefined : Boolean(value);
const tryParseJson = (value: any) => {
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const mapProblemAttachment = (attachment: any): ProblemAttachment => ({
  id: toNumber(attachment?.id),
  name: attachment?.name ?? '',
  url: attachment?.url ?? attachment?.file ?? '',
  size: toNullableNumber(attachment?.size),
  contentType: attachment?.contentType ?? attachment?.content_type ?? '',
  created: attachment?.created ?? '',
});

const mapJudgeSummaryCases = (cases: any): AttemptJudgeSummaryCase[] =>
  Array.isArray(cases)
    ? cases.map((item: any) => ({
        number: toNumber(item?.number),
        verdict: toNumber(item?.verdict),
        passed: Boolean(item?.passed),
      }))
    : [];

const mapJudgeSummaryGroups = (groups: any): AttemptJudgeSummaryGroup[] =>
  Array.isArray(groups)
    ? groups.map((group: any) => ({
        id: String(group?.id ?? ''),
        passed: Boolean(group?.passed),
        passedCases: toNumber(group?.passedCases ?? group?.passed_cases),
        totalCases: toNumber(group?.totalCases ?? group?.total_cases),
        score: toNullableNumber(group?.score),
        maxScore: toNullableNumber(group?.maxScore ?? group?.max_score),
        failedCase: toNullableNumber(group?.failedCase ?? group?.failed_case),
        verdict: toNullableNumber(group?.verdict),
        cases: mapJudgeSummaryCases(group?.cases),
      }))
    : [];

const mapJudgeSummarySubtasks = (subtasks: any): AttemptJudgeSummarySubtask[] =>
  Array.isArray(subtasks)
    ? subtasks.map((subtask: any) => ({
        id: String(subtask?.id ?? ''),
        score: toNumber(subtask?.score),
        maxScore: toNumber(subtask?.maxScore ?? subtask?.max_score),
        passed: Boolean(subtask?.passed),
      }))
    : [];

const mapJudgeSummary = (value: any): AttemptJudgeSummary | undefined => {
  const data = tryParseJson(value);
  if (!data || typeof data !== 'object') return undefined;

  const tests = data?.tests
    ? {
        passed: toNumber(data.tests?.passed),
        total: toNumber(data.tests?.total),
      }
    : undefined;

  const groups = mapJudgeSummaryGroups(data?.groups);
  const subtasks = mapJudgeSummarySubtasks(data?.subtasks);
  const score = toNullableNumber(data?.score);
  const maxScore = toNullableNumber(data?.maxScore ?? data?.max_score);
  const verdict = toNullableNumber(data?.verdict);

  if (
    !tests &&
    groups.length === 0 &&
    subtasks.length === 0 &&
    score === undefined &&
    maxScore === undefined &&
    verdict === undefined
  ) {
    return undefined;
  }

  return {
    mode: data?.mode,
    score,
    maxScore,
    tests,
    groups,
    subtasks,
    verdict,
  };
};

export const mapProblemTag = (
  tag: CategoryTag | ProblemTag | { id?: number | string; name?: string; category?: string },
): {
  id: number;
  name: string;
  category?: string;
} => ({
  id: toNumber((tag as any)?.id),
  name: (tag as any)?.name ?? '',
  category: (tag as any)?.category,
});

export const mapProblemUserInfo = (payload: any): ProblemUserInfo | undefined => {
  if (!payload) return undefined;

  const data = tryParseJson(payload) ?? {};

  return {
    hasSolved: Boolean(data?.hasSolved ?? data?.has_solved),
    hasAttempted: Boolean(data?.hasAttempted ?? data?.has_attempted),
    canViewSolution: data?.canViewSolution ?? data?.can_view_solution,
    isFavorite: data?.isFavorite ?? data?.is_favorite,
    voteType: data?.voteType ?? data?.vote_type ?? data?.vote,
  };
};

export const mapProblem = (problem: ProblemList): ProblemListItem => ({
  id: problem.id ?? 0,
  title: problem.title,
  difficulty: toNumber(problem.difficulty),
  problemRating: toNullableNumber(
    (problem as any).problemRating ?? (problem as any).problem_rating,
  ),
  difficultyTitle: problem.difficultyTitle,
  solved: toNumber(problem.solved),
  notSolved: toNumber((problem as any).notSolved ?? (problem as any).not_solved),
  attemptsCount: toNumber((problem as any).attemptsCount),
  tags: (problem.tags ?? []).map((tag) => mapProblemTag(tag)),
  likesCount: toNumber((problem as any).likesCount),
  dislikesCount: toNumber((problem as any).dislikesCount),
  hasSolution: Boolean((problem as any).hasSolution),
  hasChecker: (problem as any).hasChecker !== false,
  hidden: Boolean((problem as any).hidden),
  userInfo: mapProblemUserInfo((problem as any).userInfo ?? (problem as any).user_info),
});

const mapPageResult = <T>(
  payload: any,
  mapItem: (item: any) => T,
): PageResult<T> => {
  const page = payload?.page ?? (payload as any)?.current_page ?? 1;
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const pageSize =
    payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? (data.length ? data.length : 0);
  const total = payload?.total ?? payload?.count ?? data.length ?? 0;
  const pagesCount =
    payload?.pagesCount ??
    payload?.pages_count ??
    payload?.total_pages ??
    (pageSize ? Math.ceil(total / (pageSize || 1)) : 1);

  return {
    page,
    pageSize,
    total,
    pagesCount,
    data: data.map((item: any) => mapItem(item)),
    pinnedRows: ((payload as any)?.pinnedRows ?? (payload as any)?.pinned_rows ?? []).map(
      (item: any) => mapItem(item),
    ),
  };
};

export const mapProblemsPage = (payload: any): PageResult<ProblemListItem> =>
  mapPageResult(payload, (item) => mapProblem(item as ProblemList));

export const mapLanguages = (response: any): ProblemLanguageOption[] => {
  const items = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];
  return items.map((item: any) => ({
    lang: item.lang ?? '',
    langFull: item.langFull ?? item.lang ?? '',
  }));
};

export const mapCategories = (categories: ProblemsCategory[]): ProblemCategory[] =>
  (categories ?? []).map((category) => ({
    id: category.id ?? 0,
    title: category.title,
    code: category.code,
    description: category.description,
    problemsCount: toNumber(category.problemsCount),
    tags: (category.tags ?? []).map((tag) => mapProblemTag({ ...tag, category: category.title })),
  }));

export const mapProblemGroup = (group: any): ProblemGroup => ({
  id: toNumber(group?.id),
  name: group?.name ?? '',
  slug: group?.slug ?? '',
  parent: group?.parent ?? null,
  order: toNullableNumber(group?.order),
  problemsCount: toNullableNumber(group?.problemsCount ?? group?.problems_count),
  children: Array.isArray(group?.children) ? group.children.map((child: any) => mapProblemGroup(child)) : [],
});

export const mapProblemGroups = (payload: any): ProblemGroup[] => {
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return data.map((group: any) => mapProblemGroup(group));
};

export const mapAttempts = (response: any): ProblemAttemptSummary[] => {
  const data = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];
  return data.map((item: any) => ({
    id: item.id ?? 0,
    problemId: item.problemId ?? 0,
    problemTitle: item.problemTitle ?? '',
  }));
};

export const mapProblemUser = (payload: any): ProblemUserSummary => ({
  username: payload?.username ?? '',
  firstName: payload?.firstName ?? payload?.first_name,
  lastName: payload?.lastName ?? payload?.last_name,
  avatar: payload?.avatar ?? payload?.photo ?? payload?.avatarUrl,
  rating: payload?.rating !== undefined ? toNumber(payload.rating) : undefined,
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title,
});

export const mapContestPreview = (response: any) => {
  if (!response) return null;
  return {
    id: response.id ?? 0,
    title: response.title ?? '',
    problems: (response.problems ?? []).map((problem: any) => ({
      id: problem.id ?? 0,
      symbol: problem.symbol,
      title: problem.title ?? '',
    })),
  };
};

export const mapRatingSummary = (
  response: any,
  difficulties: DifficultyBreakdown,
): ProblemsRatingSummary | null => {
  if (!response) return null;

  return {
    solved: toNumber(response.solved),
    rating: toNumber(response.rating),
    rank: toNumber(response.rank),
    usersCount: toNumber(response.usersCount),
    difficulties,
  };
};

export const mapDifficultyBreakdown = (stats: any): DifficultyBreakdown => {
  const totals = {
    allBeginner: toNumber(stats?.allBeginner),
    allBasic: toNumber(stats?.allBasic),
    allNormal: toNumber(stats?.allNormal),
    allMedium: toNumber(stats?.allMedium),
    allAdvanced: toNumber(stats?.allAdvanced),
    allHard: toNumber(stats?.allHard),
    allExtremal: toNumber(stats?.allExtremal),
  };

  const totalProblems = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const totalSolved = toNumber(stats?.solved ?? stats?.totalSolved);

  return {
    beginner: toNumber(stats?.beginner),
    allBeginner: totals.allBeginner,
    basic: toNumber(stats?.basic),
    allBasic: totals.allBasic,
    normal: toNumber(stats?.normal),
    allNormal: totals.allNormal,
    medium: toNumber(stats?.medium),
    allMedium: totals.allMedium,
    advanced: toNumber(stats?.advanced),
    allAdvanced: totals.allAdvanced,
    hard: toNumber(stats?.hard),
    allHard: totals.allHard,
    extremal: toNumber(stats?.extremal),
    allExtremal: totals.allExtremal,
    totalSolved,
    totalProblems,
  };
};

const mapStudyPlanDayProblem = (payload: any): StudyPlanDayProblem => ({
  id: toNumber(payload?.id),
  title: payload?.title ?? '',
  difficulty: toNumber(payload?.difficulty),
  difficultyTitle: payload?.difficultyTitle ?? payload?.difficulty_title,
  tags: (payload?.tags ?? []).map((tag: any) => mapProblemTag(tag)),
  likesCount: toNullableNumber(payload?.likesCount ?? payload?.likes_count),
  dislikesCount: toNullableNumber(payload?.dislikesCount ?? payload?.dislikes_count),
  userInfo: {
    hasSolved: Boolean(payload?.hasSolved ?? payload?.has_solved),
    hasAttempted: Boolean(payload?.hasAttempted ?? payload?.has_attempted),
  },
});

const mapStudyPlanDay = (payload: any): StudyPlanDay => ({
  day: toNumber(payload?.day),
  title: payload?.title ?? '',
  description: payload?.description ?? '',
  problems: Array.isArray(payload?.problems)
    ? payload.problems.map((problem: any) => mapStudyPlanDayProblem(problem))
    : [],
});

export const mapStudyPlanListItem = (payload: any): StudyPlanListItem => ({
  id: toNumber(payload?.id),
  code: payload?.code ?? undefined,
  title: payload?.title ?? '',
  descriptionShort: payload?.descriptionShort ?? payload?.description_short ?? '',
  icon: payload?.icon ?? null,
  themeColor: payload?.themeColor ?? payload?.theme_color ?? undefined,
  themeColorSecondary: payload?.themeColorSecondary ?? payload?.theme_color_secondary ?? undefined,
  daysCount: toNullableNumber(payload?.daysCount ?? payload?.days_count),
  problemsCount: toNullableNumber(payload?.problemsCount ?? payload?.problems_count),
  isPurchased: toOptionalBoolean(payload?.isPurchased ?? payload?.is_purchased),
  solvedCount: toNullableNumber(payload?.solvedCount ?? payload?.solved_count),
  progressPercent: toNullableNumber(payload?.progressPercent ?? payload?.progress_percent),
});

export const mapStudyPlanDetail = (payload: any): StudyPlanDetail => {
  const statistics = tryParseJson(payload?.statistics);
  const days = tryParseJson(payload?.days);

  return {
    ...mapStudyPlanListItem(payload),
    description: payload?.description ?? '',
    kepcoinValue: toNumber(payload?.kepcoinValue ?? payload?.kepcoin_value),
    statistics: mapDifficultyBreakdown(statistics ?? {}),
    days: Array.isArray(days) ? days.map((item: any) => mapStudyPlanDay(item)) : [],
  };
};

const mapRecommendationProgress = (payload: any): RecommendationProgress => ({
  answered: toNumber(payload?.answered),
  total: toNumber(payload?.total),
  percent: toNumber(payload?.percent),
});

const mapRecommendationProfile = (payload: any): RecommendationProfile => ({
  mode: payload?.mode ?? 'guest',
  track: payload?.track ?? null,
  confidence: payload?.confidence ?? 'low',
  dominantCategory: payload?.dominantCategory ?? payload?.dominant_category ?? null,
  inferredLanguage: payload?.inferredLanguage ?? payload?.inferred_language ?? null,
  inferredLevel: payload?.inferredLevel ?? payload?.inferred_level ?? null,
  implicitAnswers: (payload?.implicitAnswers ?? payload?.implicit_answers ?? {}) as Record<
    string,
    string
  >,
});

const mapRecommendationQuestionOption = (payload: any): RecommendationQuestionOption => ({
  id: String(payload?.id ?? ''),
  label: payload?.label ?? '',
  helper: payload?.helper ?? undefined,
});

const mapRecommendationQuestion = (payload: any): RecommendationQuestion => ({
  id: String(payload?.id ?? ''),
  title: payload?.title ?? '',
  subtitle: payload?.subtitle ?? undefined,
  options: Array.isArray(payload?.options)
    ? payload.options.map((option: any) => mapRecommendationQuestionOption(option))
    : [],
});

const mapRecommendationFilterPatch = (payload: any): RecommendationFilterPatch => ({
  category: payload?.category ?? undefined,
  tags: Array.isArray(payload?.tags)
    ? payload.tags.map((value: any) => toNumber(value))
    : undefined,
  lang: payload?.lang ?? undefined,
  exclusive_lang: payload?.exclusive_lang ?? payload?.exclusiveLang ?? undefined,
  competitive_langs_only:
    payload?.competitive_langs_only ?? payload?.competitiveLangsOnly ?? undefined,
  difficulty: payload?.difficulty ?? undefined,
  problem_rating_min:
    payload?.problem_rating_min === undefined || payload?.problem_rating_min === null
      ? payload?.problemRatingMin === undefined || payload?.problemRatingMin === null
        ? undefined
        : String(payload?.problemRatingMin)
      : String(payload?.problem_rating_min),
  problem_rating_max:
    payload?.problem_rating_max === undefined || payload?.problem_rating_max === null
      ? payload?.problemRatingMax === undefined || payload?.problemRatingMax === null
        ? undefined
        : String(payload?.problemRatingMax)
      : String(payload?.problem_rating_max),
  status:
    payload?.status === undefined || payload?.status === null
      ? undefined
      : toNumber(payload?.status),
  ordering: payload?.ordering ?? undefined,
  has_solution: payload?.has_solution ?? payload?.hasSolution ?? undefined,
  has_checker: payload?.has_checker ?? payload?.hasChecker ?? undefined,
  partial_solvable: payload?.partial_solvable ?? payload?.partialSolvable ?? undefined,
});

const mapRecommendationResultOption = (payload: any): RecommendationResultOption => ({
  title: payload?.title ?? '',
  subtitle: payload?.subtitle ?? '',
  filterPatch: mapRecommendationFilterPatch(payload?.filterPatch ?? payload?.filter_patch),
});

export const mapRecommendationResolveResponse = (payload: any): RecommendationResolveResponse => {
  if ((payload?.status ?? '') === 'result') {
    return {
      status: 'result',
      progress: mapRecommendationProgress(payload?.progress ?? {}),
      profile: mapRecommendationProfile(payload?.profile ?? {}),
      why: payload?.why ?? '',
      primary: mapRecommendationResultOption(payload?.primary ?? {}),
      alternatives: Array.isArray(payload?.alternatives)
        ? payload.alternatives.map((item: any) => mapRecommendationResultOption(item))
        : [],
      suggestedStudyPlanId:
        payload?.suggestedStudyPlanId ?? payload?.suggested_study_plan_id ?? undefined,
      directProblemId: payload?.directProblemId ?? payload?.direct_problem_id ?? undefined,
    };
  }

  return {
    status: 'question',
    progress: mapRecommendationProgress(payload?.progress ?? {}),
    profile: mapRecommendationProfile(payload?.profile ?? {}),
    question: mapRecommendationQuestion(payload?.question ?? {}),
  };
};

export const mapProblemsRatingRow = (
  payload: any,
): ProblemsRatingRow => {
  return {
    rowIndex: toNumber(payload?.rowIndex ?? payload?.row_index),
    rating: payload?.rating !== undefined ? toNumber(payload.rating) : undefined,
    solved: payload?.solved !== undefined ? toNumber(payload.solved) : undefined,
    beginner: toNumber(payload?.beginner),
    basic: toNumber(payload?.basic),
    normal: toNumber(payload?.normal),
    medium: toNumber(payload?.medium),
    advanced: toNumber(payload?.advanced),
    hard: toNumber(payload?.hard),
    extremal: toNumber(payload?.extremal),
    user: mapProblemUser(payload?.user ?? payload),
  };
};

export const mapProblemsRatingPage = (payload: any): PageResult<ProblemsRatingRow> =>
  mapPageResult(payload, mapProblemsRatingRow);

export const mapAttempt = (payload: any): AttemptListItem => ({
  id: payload?.id ?? 0,
  user: mapProblemUser(payload?.user ?? {}),
  teamName: payload?.team?.name,
  problemId: toNumber(payload?.problemId ?? payload?.problem_id),
  problemTitle: payload?.problemTitle ?? '',
  contestProblemSymbol:
    payload?.contestProblem?.symbol ??
    payload?.contest_problem?.symbol ??
    payload?.contestProblemSymbol ??
    payload?.contest_problem_symbol,
  contestId:
    payload?.contestProblem?.contest ??
    payload?.contest_problem?.contest ??
    payload?.contestId ??
    payload?.contest_id,
  contestTime: payload?.contestTime ?? payload?.contest_time ?? null,
  verdict: payload?.verdict !== undefined ? toNumber(payload.verdict) : undefined,
  verdictTitle: payload?.verdictTitle ?? '',
  lang: payload?.lang ?? '',
  langFull: payload?.langFull ?? payload?.lang_full ?? payload?.lang,
  testCaseNumber: toNullableNumber(payload?.testCaseNumber ?? payload?.test_case_number),
  time: toNullableNumber(payload?.time),
  memory: toNullableNumber(payload?.memory),
  sourceCodeSize: toNullableNumber(payload?.sourceCodeSize ?? payload?.source_code_size),
  balls: toNullableNumber(payload?.balls),
  canView: toOptionalBoolean(payload?.canView ?? payload?.can_view),
  canTestView: toOptionalBoolean(payload?.canTestView ?? payload?.can_test_view),
  kepcoinValue: toNullableNumber(payload?.kepcoinValue ?? payload?.kepcoin_value),
  testCaseKepcoinValue: toNullableNumber(
    payload?.testCaseKepcoinValue ?? payload?.test_case_kepcoin_value,
  ),
  created: payload?.created,
  problemHasCheckInput: Boolean(
    payload?.problemHasCheckInput ?? payload?.problem_has_check_input ?? false,
  ),
  judgeSummary: mapJudgeSummary(payload?.judgeSummary ?? payload?.judge_summary),
});

export const mapAttemptDetail = (payload: any): AttemptDetail => {
  const base = mapAttempt(payload);

  return {
    ...base,
    sourceCode: payload?.sourceCode ?? payload?.source_code ?? '',
    errorMessage: payload?.errorMessage ?? payload?.error_message ?? '',
    previousAttemptId: toNullableNumber(payload?.previousAttemptId ?? payload?.previous_attempt_id),
  };
};

export const mapAttemptsPage = (payload: any): PageResult<AttemptListItem> =>
  mapPageResult(payload, (item) => mapAttempt(item));

export const mapVerdicts = (payload: any): AttemptFilterOption[] => {
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const mapped = data.map(
    (item: any): AttemptFilterOption => ({
      label:
        item.label ?? item.title ?? item.verdictTitle ?? String(item.value ?? item.verdict ?? ''),
      value: toNumber(item.value ?? item.verdict ?? item.id),
    }),
  );

  return mapped.filter((item: AttemptFilterOption) => Boolean(item.label));
};

export const mapPeriodRating = (payload: any): PeriodRatingEntry[] => {
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return data.map((item: any) => ({
    username: item.username ?? item.user?.username ?? '',
    solved: toNumber(item.solved ?? item.result),
    ratingTitle: item.ratingTitle ?? item.user?.ratingTitle,
  }));
};

export const mapRatingHistoryEntry = (payload: any): ProblemsRatingHistoryEntry => ({
  username: payload?.username ?? '',
  contestsRatingTitle: payload?.contestsRatingTitle,
  type: toNumber(payload?.type) as ProblemsRatingHistoryEntry['type'],
  result:
    payload?.result !== undefined && payload?.result !== null
      ? toNumber(payload?.result)
      : undefined,
  date: payload?.date ?? payload?.created ?? '',
});

export const mapProblemsRatingHistoryPage = (
  payload: any,
): PageResult<ProblemsRatingHistoryEntry> => mapPageResult(payload, mapRatingHistoryEntry);

export const mapAvailableLanguage = (payload: any): ProblemAvailableLanguage => ({
  lang: payload?.lang ?? '',
  langFull: payload?.langFull ?? payload?.lang ?? '',
  timeLimit: toNullableNumber(payload?.timeLimit ?? payload?.time_limit),
  memoryLimit: toNullableNumber(payload?.memoryLimit ?? payload?.memory_limit),
  codeTemplate: payload?.codeTemplate ?? payload?.code_template ?? '',
  codeGolf: toNullableNumber(payload?.codeGolf ?? payload?.code_golf),
});

export const mapSampleTest = (payload: any): ProblemSampleTest => ({
  input: payload?.input ?? '',
  output: payload?.output ?? '',
  problem: payload?.problem,
});

export const mapProblemDetail = (payload: any): ProblemDetail => {
  const base = mapProblem(payload as ProblemList);

  return {
    ...base,
    authorUsername: payload?.authorUsername ?? payload?.author_username,
    authorAvatar: payload?.authorAvatar ?? payload?.author_avatar ?? '',
    voteType: payload?.voteType ?? payload?.vote_type ?? base.userInfo?.voteType,
    timeLimit: toNullableNumber(payload?.timeLimit ?? payload?.time_limit),
    memoryLimit: toNullableNumber(payload?.memoryLimit ?? payload?.memory_limit),
    availableLanguages: (payload?.availableLanguages ?? []).map((lang: any) =>
      mapAvailableLanguage(lang),
    ),
    hasChecker: payload?.hasChecker ?? payload?.has_checker ?? base.hasChecker,
    hasSolution:
      payload?.hasSolution !== undefined
        ? Boolean(payload?.hasSolution)
        : payload?.has_solution !== undefined
          ? Boolean(payload?.has_solution)
          : base.hasSolution,
    hasCheckInput: payload?.hasCheckInput ?? payload?.has_check_input,
    solutionKepcoinValue: toNullableNumber(
      payload?.solutionKepcoinValue ?? payload?.solution_kepcoin_value,
    ),
    checkInputSource: payload?.checkInputSource ?? payload?.check_input_source ?? '',
    body: payload?.body ?? '',
    inputData: payload?.inputData ?? payload?.input_data ?? '',
    outputData: payload?.outputData ?? payload?.output_data ?? '',
    comment: payload?.comment ?? '',
    attachments: (payload?.attachments ?? []).map((attachment: any) =>
      mapProblemAttachment(attachment),
    ),
    sampleTests: (payload?.sampleTests ?? payload?.sample_tests ?? []).map((item: any) =>
      mapSampleTest(item),
    ),
    topics: (payload?.topics ?? []).map(
      (topic: any): ProblemTopic => ({
        id: toNumber(topic?.id),
        name: topic?.name ?? '',
      }),
    ),
    similarProblems: (payload?.similarProblems ?? payload?.similar_problems ?? []).map(
      (problem: any): SimilarProblem => ({
        id: toNumber(problem?.id),
        title: problem?.title ?? '',
        difficulty: toNumber(problem?.difficulty),
        problemRating: toNullableNumber(problem?.problemRating ?? problem?.problem_rating),
        difficultyTitle: problem?.difficultyTitle ?? problem?.difficulty_title,
        score:
          typeof problem?.score === 'number' ? problem.score : toNullableNumber(problem?.score),
        tags: (problem?.tags ?? []).map((tag: any) => mapProblemTag(tag)),
        topics: (problem?.topics ?? []).map(
          (topic: any): ProblemTopic => ({
            id: toNumber(topic?.id),
            name: topic?.name ?? '',
          }),
        ),
      }),
    ),
    image: payload?.image ?? null,
    partialSolvable: payload?.partialSolvable ?? payload?.partial_solvable,
    userInfo: mapProblemUserInfo(payload?.userInfo ?? payload?.user_info) ?? base.userInfo,
  };
};

export const mapProblemSolution = (payload: any): ProblemSolution => ({
  solution: payload?.solution ?? '',
  codes: Array.isArray(payload?.codes)
    ? payload.codes.map((code: any) => ({
        lang: code?.lang ?? '',
        code: code?.code ?? '',
      }))
    : [],
});

export const mapProblemVoteResult = (payload: any): ProblemVoteResult => ({
  likesCount: toNumber(payload?.likesCount ?? payload?.likes_count),
  dislikesCount: toNumber(payload?.dislikesCount ?? payload?.dislikes_count),
  voteType: payload?.voteType ?? payload?.vote_type,
  isFavorite: payload?.isFavorite ?? payload?.is_favorite ?? payload?.userInfo?.isFavorite,
});

const mapTopAttemptsList = (payload: any[] | undefined): ProblemTopAttempt[] =>
  (payload ?? []).map(
    (item: any): ProblemTopAttempt => ({
      username: item?.username ?? '',
      avatar: item?.avatar ?? undefined,
      ratingTitle: item?.ratingTitle ?? item?.rating_title,
      time: toNullableNumber(item?.time),
      memory: toNullableNumber(item?.memory),
      sourceCodeSize: toNullableNumber(item?.sourceCodeSize ?? item?.source_code_size),
    }),
  );

export const mapProblemStatistics = (payload: any): ProblemStatistics => ({
  attemptStatistics: (payload?.attemptStatistics ?? []).map(
    (item: any): ProblemAttemptStatistic => ({
      verdict: toNumber(item?.verdict),
      verdictTitle: item?.verdictTitle ?? '',
      value: toNumber(item?.value),
      color: item?.color ?? 'primary',
    }),
  ),
  languageStatistics: (payload?.languageStatistics ?? []).map(
    (item: any): ProblemLanguageStatistic => ({
      langFull: item?.langFull ?? '',
      lang: item?.lang ?? '',
      value: toNumber(item?.value),
    }),
  ),
  topAttempts: {
    time: mapTopAttemptsList(payload?.topAttempts?.time),
    memory: mapTopAttemptsList(payload?.topAttempts?.memory),
    sourceCodeSize: mapTopAttemptsList(payload?.topAttempts?.sourceCodeSize),
  },
  attemptsForSolveStatistics: (payload?.attemptsForSolveStatistics ?? []).map(
    (item: any): ProblemAttemptsForSolveStatistic => ({
      attempts: toNumber(item?.attempts),
      value: toNumber(item?.value),
    }),
  ),
});

export const mapProblemSolver = (payload: any): ProblemSolver => ({
  userId: toNumber(payload?.userId ?? payload?.user_id),
  username: payload?.username ?? '',
  avatar: payload?.avatar ?? undefined,
  rating: toNullableNumber(payload?.rating),
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title,
  firstSolvedAt: payload?.firstSolvedAt ?? payload?.first_solved_at,
  latestSolvedAt: payload?.latestSolvedAt ?? payload?.latest_solved_at,
  attemptsToSolve: toNullableNumber(payload?.attemptsToSolve ?? payload?.attempts_to_solve),
  shortestCodeSize: toNullableNumber(payload?.shortestCodeSize ?? payload?.shortest_code_size),
});

export const mapProblemSolversPage = (payload: any): PageResult<ProblemSolver> =>
  mapPageResult(payload, (item) => mapProblemSolver(item));

const mapFactAttempt = (fact: any) => {
  if (!fact) return null;

  return {
    problemId: toNumber(fact?.problemId ?? fact?.problem_id),
    problemTitle: fact?.problemTitle ?? fact?.problem_title ?? '',
    datetime: fact?.datetime ?? fact?.date,
    verdict: fact?.verdict !== undefined ? toNumber(fact?.verdict) : undefined,
    verdictTitle: fact?.verdictTitle ?? fact?.verdict_title,
    attemptsCount:
      fact?.attemptsCount !== undefined
        ? toNumber(fact?.attemptsCount ?? fact?.attempts_count)
        : undefined,
  };
};

const mapTimeEntry = (item: any) => ({
  label: item?.day ?? item?.month ?? item?.period ?? item?.label ?? '',
  solved: toNumber(item?.solved ?? item?.value),
});

const mapHeatmapRange = (meta: any) => {
  const heatmapRange = meta?.heatmapRange ?? meta?.heatmap_range;
  if (!heatmapRange) return undefined;

  return {
    from: heatmapRange.from ?? heatmapRange?.from_date,
    to: heatmapRange.to ?? heatmapRange?.to_date,
  };
};

export const mapProblemsUserStatisticsActivity = (payload: any): ProblemsUserStatisticsActivity => {
  const lastDays = payload?.lastDays ?? payload?.last_days ?? {};
  const meta = payload?.meta ?? {};
  const metaLastDays = meta?.lastDays ?? meta?.last_days;

  return {
    lastDays: {
      series: Array.isArray(lastDays?.series)
        ? lastDays.series.map((value: any) => toNumber(value))
        : [],
      solved: toNumber(lastDays?.solved),
    },
    meta: {
      lastDays:
        metaLastDays === undefined || metaLastDays === null ? undefined : toNumber(metaLastDays),
      allowedLastDays: (meta?.allowedLastDays ?? meta?.allowed_last_days ?? [])
        .map((item: any) => toNumber(item))
        .filter((item: number) => item > 0),
    },
  };
};

export const mapProblemsUserStatisticsHeatmap = (payload: any): ProblemsUserStatisticsHeatmap => {
  const meta = payload?.meta ?? {};

  return {
    heatmap: (payload?.heatmap ?? []).map((item: any) => ({
      date: item?.date ?? item?.day ?? '',
      solved: toNumber(item?.solved ?? item?.value),
    })),
    meta: {
      heatmapRange: mapHeatmapRange(meta),
    },
  };
};

export const mapProblemsUserStatistics = (payload: any): ProblemsUserStatistics => {
  const general = payload?.general ?? payload ?? {};
  const attemptsRaw = payload?.numberOfAttempts ?? payload?.number_of_attempts ?? {};
  const activity = mapProblemsUserStatisticsActivity(payload);
  const heatmap = mapProblemsUserStatisticsHeatmap(payload);

  return {
    general: {
      solved: toNumber(general?.solved ?? payload?.solved),
      rating: toNumber(general?.rating ?? payload?.rating),
      rank: general?.rank ?? payload?.rank ?? '-',
      usersCount: toNumber(
        general?.usersCount ?? general?.users_count ?? payload?.usersCount ?? payload?.users_count,
      ),
    },
    byDifficulty: mapDifficultyBreakdown(payload?.byDifficulty ?? payload?.difficulty ?? payload),
    byTopic: (payload?.byTopic ?? payload?.topics ?? []).map((item: any) => ({
      id: toNumber(item?.id),
      topic: item?.topic ?? item?.name ?? '',
      code: item?.code,
      solved: toNumber(item?.solved ?? item?.value),
    })),
    facts: {
      firstAttempt: mapFactAttempt(payload?.facts?.firstAttempt),
      lastAttempt: mapFactAttempt(payload?.facts?.lastAttempt),
      firstAccepted: mapFactAttempt(payload?.facts?.firstAccepted),
      lastAccepted: mapFactAttempt(payload?.facts?.lastAccepted),
      mostAttemptedProblem: mapFactAttempt(payload?.facts?.mostAttemptedProblem),
      mostAttemptedForSolveProblem: mapFactAttempt(payload?.facts?.mostAttemptedForSolveProblem),
      solvedWithSingleAttempt: toNumber(payload?.facts?.solvedWithSingleAttempt),
      solvedWithSingleAttemptPercentage: toNumber(
        payload?.facts?.solvedWithSingleAttemptPercentage,
      ),
    },
    byLang: (payload?.byLang ?? payload?.langs ?? []).map((item: any) => ({
      lang: item?.lang ?? '',
      langFull: item?.langFull ?? item?.lang ?? '',
      solved: toNumber(item?.solved ?? item?.value),
    })),
    byTag: (payload?.byTag ?? payload?.tags ?? []).map((item: any) => ({
      name: item?.name ?? '',
      value: toNumber(item?.value),
    })),
    byWeekday: (payload?.byWeekday ?? []).map(mapTimeEntry),
    byMonth: (payload?.byMonth ?? []).map(mapTimeEntry),
    byPeriod: (payload?.byPeriod ?? []).map(mapTimeEntry),
    lastDays: activity.lastDays,
    heatmap: heatmap.heatmap,
    numberOfAttempts: {
      chartSeries: (attemptsRaw?.chartSeries ?? attemptsRaw?.chart_series ?? []).map(
        (item: any) => ({
          attemptsCount: toNumber(item?.attemptsCount ?? item?.attempts ?? item?.x),
          value: toNumber(item?.value ?? item?.y),
        }),
      ),
    },
    meta: {
      ...activity.meta,
      ...heatmap.meta,
    },
  };
};
