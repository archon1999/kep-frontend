import { Hackathon as HackathonDto } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Hackathon } from '../../domain/entities/hackathon.entity';
import { HackathonProject, HackathonRegistrant, HackathonStanding } from '../../domain/entities/hackathon-project.entity';
import { PageResult } from '../../domain/ports/hackathons.repository';

export const mapHackathon = (payload: HackathonDto): Hackathon => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  slug: payload?.slug ?? '',
  description: payload?.description ?? '',
  startTime: payload?.startTime ?? (payload as any)?.start_time,
  finishTime: payload?.finishTime ?? (payload as any)?.finish_time,
  logo: payload?.logo ?? null,
  status: payload?.status ?? (payload as any)?.status,
  projectsCount: payload?.projectsCount ?? (payload as any)?.projects_count ?? 0,
  participantsCount: payload?.participantsCount ?? (payload as any)?.participants_count ?? 0,
  registrantsCount: payload?.registrantsCount ?? (payload as any)?.registrants_count ?? 0,
  isRegistered: Boolean(payload?.isRegistered ?? (payload as any)?.is_registered ?? false),
  isParticipated: Boolean(payload?.isParticipated ?? (payload as any)?.is_participated ?? false),
});

export const mapHackathonProject = (payload: any): HackathonProject => ({
  id: payload?.id ?? 0,
  symbol: payload?.symbol ?? '',
  project: payload?.project,
});

export const mapHackathonStanding = (payload: any): HackathonStanding => ({
  username: payload?.username ?? '',
  userAvatar: payload?.userAvatar ?? payload?.user_avatar,
  userFullName: payload?.userFullName ?? payload?.user_full_name,
  points: payload?.points ?? 0,
  projectResults: payload?.projectResults ?? payload?.project_results ?? payload?.projectresults,
  rank: payload?.rank,
});

export const mapHackathonRegistrant = (payload: any): HackathonRegistrant => ({
  username: payload?.username ?? '',
  userAvatar: payload?.userAvatar ?? payload?.user_avatar,
  userFullName: payload?.userFullName ?? payload?.user_full_name,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
