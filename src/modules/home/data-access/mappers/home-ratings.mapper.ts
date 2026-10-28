import type { HomeRatingEntry, HomeUserRatings } from '../../domain/entities/home.entity';

const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
const number = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;
const mapRating = (value: unknown): HomeRatingEntry => {
  const source = record(value);
  return {
    value: number(source.value),
    rank: number(source.rank),
    percentile: number(source.percentile),
    title: typeof source.title === 'string' ? source.title : undefined,
  };
};

export const mapHomeUserRatings = (value: unknown): HomeUserRatings => {
  const source = record(value);
  return {
    skillsRating: mapRating(source.skillsRating),
    activityRating: mapRating(source.activityRating),
    contestsRating: mapRating(source.contestsRating),
    challengesRating: mapRating(source.challengesRating),
  };
};
