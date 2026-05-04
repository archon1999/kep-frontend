export interface ContestsRatingLevel {
  min: number;
  title: string;
  color: string;
}

export const CONTESTS_RATING_LEVELS: ContestsRatingLevel[] = [
  { min: 0, title: 'NEOFIT', color: '#808080' },
  { min: 1200, title: 'RITOR', color: '#008000' },
  { min: 1400, title: 'LIKTOR', color: '#03A89E' },
  { min: 1600, title: 'LEGAT', color: '#0000FF' },
  { min: 1800, title: 'MASTER', color: '#AA00AA' },
  { min: 2000, title: 'MAGISTR', color: '#FF8C00' },
  { min: 2200, title: 'PRETOR', color: '#FF8C00' },
  { min: 2400, title: 'ARCHON', color: '#FF0000' },
  { min: 2500, title: 'POLEMARCH', color: '#E60000' },
  { min: 2600, title: 'MALIK', color: '#D40000' },
  { min: 2800, title: 'MAYAR', color: '#C00000' },
  { min: 3000, title: 'VALAR', color: '#B00000' },
  { min: 3200, title: 'RIDWAN', color: '#A00000' },
];

const ratingImages = import.meta.glob('../../assets/images/contests/ratings/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const ratingImageMap = Object.entries(ratingImages).reduce<Record<string, string>>(
  (acc, [path, value]) => {
    const fileName = path.split('/').pop();
    if (!fileName) {
      return acc;
    }

    acc[fileName.replace(/\.png$/i, '').toLowerCase()] = value;
    return acc;
  },
  {},
);

export const normalizeContestsRatingTitle = (title?: string | null) =>
  title?.trim().toLowerCase() ?? '';

export const getContestsRatingImageSrc = (title?: string | null) => {
  const key = normalizeContestsRatingTitle(title);
  return key ? (ratingImageMap[key] ?? null) : null;
};

export const getContestsRatingLevelByTitle = (title?: string | null) => {
  const normalizedTitle = normalizeContestsRatingTitle(title);
  return (
    CONTESTS_RATING_LEVELS.find(
      (level) => normalizeContestsRatingTitle(level.title) === normalizedTitle,
    ) ?? null
  );
};

export const getContestsRatingLevelByRating = (rating?: number | null) => {
  if (rating === undefined || rating === null || Number.isNaN(rating)) {
    return null;
  }

  return (
    [...CONTESTS_RATING_LEVELS].reverse().find((level) => rating >= level.min) ??
    CONTESTS_RATING_LEVELS[0]
  );
};
