import { Contest } from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestDetail, ContestUserInfo } from '../../domain/entities/contest-detail.entity';
import { parseContestStatus } from '../../domain/entities/contest-status';
import { mapContest } from './contest.mapper';

const mapContestUserInfo = (payload: any): ContestUserInfo => ({
  isParticipated: Boolean(payload?.isParticipated ?? payload?.is_participated ?? false),
  isRegistered: Boolean(payload?.isRegistered ?? payload?.is_registered ?? false),
  doubleRatingPurchased: Boolean(
    payload?.doubleRatingPurchased ?? payload?.double_rating_purchased ?? false,
  ),
  saveRatingPurchased: Boolean(payload?.saveRatingPurchased ?? payload?.save_rating_purchased ?? false),
  virtualContestPurchased: Boolean(
    payload?.virtualContestPurchased ?? payload?.virtual_contest_purchased ?? false,
  ),
  unratedContestPurchased: Boolean(
    payload?.unratedContestPurchased ?? payload?.unrated_contest_purchased ?? false,
  ),
});

export const mapContestDetail = (payload: Contest | any): ContestDetail => {
  const base = mapContest(payload as Contest);

  return {
    ...base,
    statusCode: parseContestStatus(payload?.status),
    startTime: payload?.startTime ?? (payload as any)?.start_time ?? base.startTime,
    finishTime: payload?.finishTime ?? (payload as any)?.finish_time ?? base.finishTime,
    participationType:
      payload?.participationType ?? (payload as any)?.participation_type ?? base.participationType,
    userInfo:
      payload?.userInfo || (payload as any)?.user_info
        ? mapContestUserInfo(payload?.userInfo ?? (payload as any)?.user_info)
        : null,
  };
};
