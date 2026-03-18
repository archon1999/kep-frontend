import type {
  HomePromoSourceItem,
  HomePromoSlideType,
  HomePromoSlideStatus,
  HomePromoTopEntry,
} from '../../domain/entities/home-promo.entity';

interface ApiHomePromoTopEntry {
  id: number;
  coverPhoto?: string;
  cover_photo?: string;
  likesCount?: number;
  likes_count?: number;
  user?: {
    username?: string;
  };
}

export interface ApiHomePromoItem {
  id: number;
  type: HomePromoSlideType;
  status: HomePromoSlideStatus;
  title: string;
  description?: string | null;
  logo?: string | null;
  startTime?: string | null;
  start_time?: string | null;
  endTime?: string | null;
  end_time?: string | null;
  previewImages?: string[];
  preview_images?: string[];
  topEntries?: ApiHomePromoTopEntry[];
  top_entries?: ApiHomePromoTopEntry[];
  totalEntries?: number | null;
  total_entries?: number | null;
  maxVoteCount?: number | null;
  max_vote_count?: number | null;
  remainingVotes?: number | null;
  remaining_votes?: number | null;
  categoryTitle?: string | null;
  category_title?: string | null;
  isRated?: boolean | null;
  is_rated?: boolean | null;
  contestantsCount?: number | null;
  contestants_count?: number | null;
  registrantsCount?: number | null;
  registrants_count?: number | null;
  problemsCount?: number | null;
  problems_count?: number | null;
  questionsCount?: number | null;
  questions_count?: number | null;
  timeSeconds?: number | null;
  time_seconds?: number | null;
  chaptersCount?: number | null;
  chapters_count?: number | null;
  chapterTitles?: string[];
  chapter_titles?: string[];
}

const mapTopEntry = (entry: ApiHomePromoTopEntry): HomePromoTopEntry => ({
  id: entry.id,
  coverPhoto: entry.coverPhoto ?? entry.cover_photo ?? '',
  likesCount: entry.likesCount ?? entry.likes_count ?? 0,
  user: {
    username: entry.user?.username ?? '',
  },
});

export const mapHomePromoItem = (item: ApiHomePromoItem): HomePromoSourceItem => ({
  id: item.id,
  type: item.type,
  status: item.status,
  title: item.title,
  description: item.description ?? null,
  logo: item.logo ?? null,
  startTime: item.startTime ?? item.start_time ?? null,
  endTime: item.endTime ?? item.end_time ?? null,
  previewImages: item.previewImages ?? item.preview_images ?? [],
  topEntries: (item.topEntries ?? item.top_entries ?? []).map(mapTopEntry),
  totalEntries: item.totalEntries ?? item.total_entries ?? null,
  maxVoteCount: item.maxVoteCount ?? item.max_vote_count ?? null,
  remainingVotes: item.remainingVotes ?? item.remaining_votes ?? null,
  categoryTitle: item.categoryTitle ?? item.category_title ?? null,
  isRated: item.isRated ?? item.is_rated ?? null,
  contestantsCount: item.contestantsCount ?? item.contestants_count ?? null,
  registrantsCount: item.registrantsCount ?? item.registrants_count ?? null,
  problemsCount: item.problemsCount ?? item.problems_count ?? null,
  questionsCount: item.questionsCount ?? item.questions_count ?? null,
  timeSeconds: item.timeSeconds ?? item.time_seconds ?? null,
  chaptersCount: item.chaptersCount ?? item.chapters_count ?? null,
  chapterTitles: item.chapterTitles ?? item.chapter_titles ?? [],
});

export const mapHomePromos = (items: ApiHomePromoItem[]): HomePromoSourceItem[] => items.map(mapHomePromoItem);
