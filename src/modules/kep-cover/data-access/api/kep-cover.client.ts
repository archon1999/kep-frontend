import { axiosMutator } from 'shared/api/http/axiosMutator';

interface ApiKepCoverUser {
  id: number;
  username: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  avatar?: string;
}

interface ApiKepCoverEntry {
  id: number;
  user: ApiKepCoverUser;
  coverPhoto?: string;
  cover_photo: string;
  likesCount?: number;
  likes_count: number;
  isLiked?: boolean;
  is_liked: boolean;
  joinedAt?: string;
  joined_at: string;
}

export interface ApiKepCoverSummary {
  id: number | null;
  title: string;
  startTime?: string | null;
  start_time: string | null;
  endTime?: string | null;
  end_time: string | null;
  status: 'empty' | 'upcoming' | 'active' | 'finished';
  maxVoteCount?: number;
  max_vote_count: number;
  totalEntries?: number;
  total_entries: number;
  remainingVotes?: number;
  remaining_votes: number;
  canVote?: boolean;
  can_vote: boolean;
  isVotingOpen?: boolean;
  is_voting_open: boolean;
  topEntries?: ApiKepCoverEntry[];
  top_entries: ApiKepCoverEntry[];
}

export interface ApiKepCoverVoteState {
  likesCount?: number;
  likes_count: number;
  isLiked?: boolean;
  is_liked: boolean;
  remainingVotes?: number;
  remaining_votes: number;
}

export interface ApiPageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export const kepCoverApiClient = {
  summary: () => axiosMutator<ApiKepCoverSummary>({ url: '/api/kep-cover', method: 'GET' }),
  entries: (params?: { page?: number; pageSize?: number }) =>
    axiosMutator<ApiPageResult<ApiKepCoverEntry>>({
      url: '/api/kep-cover/entries',
      method: 'GET',
      params: { page: params?.page, page_size: params?.pageSize },
    }),
  vote: (entryId: number | string) =>
    axiosMutator<ApiKepCoverVoteState>({
      url: `/api/kep-cover/entries/${entryId}/vote`,
      method: 'POST',
    }),
};
