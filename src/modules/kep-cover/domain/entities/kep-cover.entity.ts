export interface KepCoverUser {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface KepCoverEntry {
  id: number;
  user: KepCoverUser;
  coverPhoto: string;
  likesCount: number;
  isLiked: boolean;
  joinedAt: string;
}

export type KepCoverContestStatus = 'empty' | 'upcoming' | 'active' | 'finished';

export interface KepCoverContestSummary {
  id: number | null;
  title: string;
  startTime: string | null;
  endTime: string | null;
  status: KepCoverContestStatus;
  maxVoteCount: number;
  totalEntries: number;
  remainingVotes: number;
  canVote: boolean;
  isVotingOpen: boolean;
  topEntries: KepCoverEntry[];
}

export interface KepCoverVoteState {
  likesCount: number;
  isLiked: boolean;
  remainingVotes: number;
}
