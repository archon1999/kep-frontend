import { ContestParticipationType, ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestListItem } from './contest.entity';
import { ContestStatus } from './contest-status';

export interface ContestUserInfo {
  isParticipated: boolean;
  isRegistered: boolean;
  doubleRatingPurchased?: boolean;
  saveRatingPurchased?: boolean;
  virtualContestPurchased?: boolean;
  unratedContestPurchased?: boolean;
}

export interface ContestDetail extends ContestListItem {
  statusCode: ContestStatus;
  startTime?: string;
  finishTime?: string;
  type: ContestType;
  participationType: ContestParticipationType;
  userInfo?: ContestUserInfo | null;
}
