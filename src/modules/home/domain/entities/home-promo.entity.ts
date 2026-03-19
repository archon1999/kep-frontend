export type HomePromoSlideType = 'kepCover' | 'contest' | 'arena' | 'blogCreate';
export type HomePromoSlideStatus = 'active' | 'upcoming';
export type HomePromoAccent = 'warning' | 'info' | 'success';

export interface HomePromoMetric {
  label: string;
  value: string;
}

export interface HomePromoTopEntry {
  id: number;
  coverPhoto: string;
  likesCount: number;
  user: {
    username: string;
  };
}

export interface HomePromoSourceItem {
  id: number;
  type: HomePromoSlideType;
  status: HomePromoSlideStatus;
  title: string;
  description?: string | null;
  logo?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  previewImages?: string[];
  topEntries?: HomePromoTopEntry[];
  totalEntries?: number | null;
  maxVoteCount?: number | null;
  remainingVotes?: number | null;
  categoryTitle?: string | null;
  isRated?: boolean | null;
  contestantsCount?: number | null;
  registrantsCount?: number | null;
  problemsCount?: number | null;
  questionsCount?: number | null;
  timeSeconds?: number | null;
  chaptersCount?: number | null;
  chapterTitles?: string[];
}

export interface HomePromoSlide {
  id: string;
  type: HomePromoSlideType;
  status: HomePromoSlideStatus;
  title: string;
  subtitle: string;
  href: string;
  ctaLabel: string;
  accent: HomePromoAccent;
  icon: string;
  typeLabel: string;
  description?: string | null;
  logo?: string | null;
  metrics: HomePromoMetric[];
  startTime?: string | null;
  endTime?: string | null;
  previewImages?: string[];
  topEntries?: HomePromoTopEntry[];
  totalEntries?: number | null;
  maxVoteCount?: number | null;
  remainingVotes?: number | null;
  isRated?: boolean | null;
  contestantsCount?: number | null;
  registrantsCount?: number | null;
  problemsCount?: number | null;
  questionsCount?: number | null;
  timeSeconds?: number | null;
  chaptersCount?: number | null;
  chapterTitles?: string[];
}
