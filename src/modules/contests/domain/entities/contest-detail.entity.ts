import { ContestParticipationType, ContestType } from 'modules/contests/domain/enums/contest.enums';
import { ContestStatus } from './contest-status';
import { ContestListItem } from './contest.entity';

export interface ContestUserInfo {
  isParticipated: boolean;
  isRegistered: boolean;
  doubleRatingPurchased?: boolean;
  saveRatingPurchased?: boolean;
  virtualContestPurchased?: boolean;
  virtualContestAvailable?: number;
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
