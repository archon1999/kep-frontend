export interface ChallengesRatingLevel {
  min: number;
  title: string;
  color: string;
}

export const CHALLENGES_RATING_LEVELS: ChallengesRatingLevel[] = [
  { min: 0, title: 'R4', color: '#808080' },
  { min: 1400, title: 'R3', color: '#008000' },
  { min: 1600, title: 'R2', color: '#03A89E' },
  { min: 1800, title: 'R1', color: '#0000FF' },
  { min: 2000, title: 'CM', color: '#AA00AA' },
  { min: 2200, title: 'M', color: '#FFB300' },
  { min: 2300, title: 'IM', color: '#FF8C00' },
  { min: 2400, title: 'GM', color: '#FF0000' },
  { min: 2500, title: 'SGM', color: '#111111' },
];

export const normalizeChallengesRatingTitle = (title?: string | null) =>
  title?.trim().toUpperCase() ?? '';

export const getChallengesRatingLevelByTitle = (title?: string | null) => {
  const normalizedTitle = normalizeChallengesRatingTitle(title);
  return (
    CHALLENGES_RATING_LEVELS.find(
      (level) => normalizeChallengesRatingTitle(level.title) === normalizedTitle,
    ) ?? null
  );
};

export const getChallengesRatingLevelByRating = (rating?: number | null) => {
  if (rating === undefined || rating === null || Number.isNaN(rating)) {
    return null;
  }

  return (
    [...CHALLENGES_RATING_LEVELS].reverse().find((level) => rating >= level.min) ??
    CHALLENGES_RATING_LEVELS[0]
  );
};
