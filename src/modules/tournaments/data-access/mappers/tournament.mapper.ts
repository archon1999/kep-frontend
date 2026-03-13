import {
  DuelPlayer,
  TournamentDetail,
  TournamentList,
  TournamentPlayer,
  TournamentStage,
  TournamentStageDuel,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  TournamentDetailEntity,
  TournamentListItem,
  TournamentPlayerProfile,
  TournamentStageInfo,
  TournamentStageMatch,
} from '../../domain/entities/tournament.entity';
import { PageResult } from '../../domain/ports/tournaments.repository';

const mapTournamentPlayer = (payload?: TournamentPlayer): TournamentPlayerProfile => ({
  id: payload?.id ?? 0,
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? '',
});

const mapDuelPlayer = (payload?: DuelPlayer): TournamentPlayerProfile => ({
  id: payload?.id ?? 0,
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? '',
  status: payload?.status ?? undefined,
  balls: payload?.balls,
});

const mapDuel = (payload?: TournamentStageDuel['duel']): TournamentStageMatch['duel'] => ({
  id: payload?.id,
  startTime: payload?.startTime ?? null,
  finishTime: payload?.finishTime ?? null,
  status: payload?.status ?? 0,
  isConfirmed: payload?.isConfirmed,
  isPlayer: payload?.isPlayer,
  playerFirst: mapDuelPlayer(payload?.playerFirst),
  playerSecond: payload?.playerSecond ? mapDuelPlayer(payload.playerSecond) : undefined,
});

const mapStageDuel = (payload?: TournamentStageDuel): TournamentStageMatch => ({
  number: payload?.number ?? 0,
  duel: mapDuel(payload?.duel),
});

const mapStage = (payload?: TournamentStage): TournamentStageInfo => ({
  title: payload?.title ?? undefined,
  number: payload?.number ?? 0,
  startTime: payload?.startTime ?? null,
  duels: (payload?.duels ?? []).map(mapStageDuel),
});

export const mapTournamentListItem = (payload: TournamentList): TournamentListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  type: payload?.type ?? 'LessCode',
  startTime: payload?.startTime ?? '',
  playersCount: payload?.playersCount ?? 0,
});

export const mapTournamentDetail = (payload: TournamentDetail): TournamentDetailEntity => ({
  id: payload?.id,
  title: payload?.title ?? '',
  description: payload?.description ?? '',
  type: payload?.type ?? 'LessCode',
  startTime: payload?.startTime ?? '',
  players: (payload?.players ?? []).map(mapTournamentPlayer),
  stages: (payload?.stages ?? []).map(mapStage),
  isRegistered: payload?.isRegistered,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
