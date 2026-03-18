import {
  ApiKepCoverSummary,
  ApiKepCoverVoteState,
  ApiPageResult,
} from '../api/kep-cover.client';
import { KepCoverContestSummary, KepCoverEntry, KepCoverVoteState } from '../../domain/entities/kep-cover.entity';
import { PageResult } from '../../domain/ports/kep-cover.repository';

const mapEntry = (entry: any): KepCoverEntry => ({
  id: entry.id,
  user: {
    id: entry.user.id,
    username: entry.user.username,
    firstName: entry.user.firstName ?? entry.user.first_name,
    lastName: entry.user.lastName ?? entry.user.last_name,
    avatar: entry.user.avatar,
  },
  coverPhoto: entry.coverPhoto ?? entry.cover_photo ?? '',
  likesCount: entry.likesCount ?? entry.likes_count ?? 0,
  isLiked: Boolean(entry.isLiked ?? entry.is_liked),
  joinedAt: entry.joinedAt ?? entry.joined_at,
});

export const mapKepCoverSummary = (summary: ApiKepCoverSummary): KepCoverContestSummary => ({
  id: summary.id,
  title: summary.title,
  startTime: summary.startTime ?? summary.start_time,
  endTime: summary.endTime ?? summary.end_time,
  status: summary.status,
  maxVoteCount: summary.maxVoteCount ?? summary.max_vote_count,
  totalEntries: summary.totalEntries ?? summary.total_entries ?? 0,
  remainingVotes: summary.remainingVotes ?? summary.remaining_votes ?? 0,
  canVote: Boolean(summary.canVote ?? summary.can_vote),
  isVotingOpen: Boolean(summary.isVotingOpen ?? summary.is_voting_open),
  topEntries: Array.isArray(summary.topEntries ?? summary.top_entries)
    ? (summary.topEntries ?? summary.top_entries).map(mapEntry)
    : [],
});

export const mapKepCoverPage = (page: ApiPageResult<any>): PageResult<KepCoverEntry> => ({
  ...page,
  data: Array.isArray(page.data) ? page.data.map(mapEntry) : [],
});

export const mapKepCoverVoteState = (state: ApiKepCoverVoteState): KepCoverVoteState => ({
  likesCount: state.likesCount ?? state.likes_count,
  isLiked: Boolean(state.isLiked ?? state.is_liked),
  remainingVotes: state.remainingVotes ?? state.remaining_votes,
});
