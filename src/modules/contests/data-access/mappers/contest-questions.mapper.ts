import { ContestQuestion } from '../../domain/entities/contest-question.entity';

export const mapContestQuestion = (payload: any): ContestQuestion => ({
  problemSymbol: payload?.problemSymbol ?? payload?.problem_symbol ?? '',
  problemTitle: payload?.problemTitle ?? payload?.problem_title ?? '',
  username: payload?.username ?? payload?.user?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? payload?.user?.ratingTitle,
  question: payload?.question ?? '',
  answer: payload?.answer ?? null,
  created: payload?.created ?? payload?.created_at ?? '',
  status: payload?.status ?? payload?.status_code ?? 0,
  statusTitle: payload?.statusTitle ?? payload?.status_title ?? '',
});

export const mapContestQuestions = (payload: any): ContestQuestion[] => {
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return data.map(mapContestQuestion);
};
