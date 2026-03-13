import { mapAttemptsPage } from 'modules/problems/data-access/mappers/problems.mapper.ts';
import { AttemptListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import { PageResult, DuelsListParams, DuelsRepository } from '../../domain/ports/duels.repository.ts';
import {
  Duel,
  DuelPreset,
  DuelReadyPlayer,
  DuelReadyStatus,
  DuelResults,
  DuelsRatingRow,
} from '../../domain/index.ts';
import { duelsApiClient } from '../api/duels.client.ts';
import {
  mapDuel,
  mapDuelsRatingRow,
  mapDuelPreset,
  mapDuelResults,
  mapPageResult,
  mapReadyPlayer,
  mapReadyStatus,
} from '../mappers/duel.mapper.ts';

export class HttpDuelsRepository implements DuelsRepository {
  async getDuels(params?: DuelsListParams): Promise<PageResult<Duel>> {
    const response = await duelsApiClient.listDuels(params);
    return mapPageResult(response, mapDuel);
  }

  async getMyDuels(params?: DuelsListParams): Promise<PageResult<Duel>> {
    const response = await duelsApiClient.listMyDuels(params);
    return mapPageResult(response, mapDuel);
  }

  async getDuel(id: number | string): Promise<Duel> {
    const response = await duelsApiClient.getDuel(id);
    return mapDuel(response);
  }

  async confirmDuel(id: number): Promise<void> {
    await duelsApiClient.confirmDuel(id);
  }

  async getDuelResults(id: number | string): Promise<DuelResults> {
    const response = await duelsApiClient.getDuelResults(id);
    return mapDuelResults(response);
  }

  async getProblemAttempts(
    duelId: number,
    duelProblem: string,
    pageSize?: number,
  ): Promise<PageResult<AttemptListItem>> {
    const response = await duelsApiClient.getProblemAttempts(duelId, duelProblem, pageSize);
    const page = mapAttemptsPage(response);
    return {
      ...page,
      count: page.total,
    } satisfies PageResult<AttemptListItem>;
  }

  async getReadyStatus(): Promise<DuelReadyStatus> {
    const response = await duelsApiClient.getReadyStatus();
    return mapReadyStatus(response);
  }

  async updateReadyStatus(ready: boolean): Promise<DuelReadyStatus> {
    const response = await duelsApiClient.updateReadyStatus(ready);
    return mapReadyStatus(response);
  }

  async getReadyPlayers(params?: { page?: number; pageSize?: number }): Promise<PageResult<DuelReadyPlayer>> {
    const response = await duelsApiClient.listReadyPlayers(params);
    return mapPageResult(response, mapReadyPlayer);
  }

  async getDuelPresets(username: string): Promise<DuelPreset[]> {
    const response = await duelsApiClient.listDuelPresets(username);
    const data = Array.isArray(response?.data) ? response.data : response;
    return (data ?? []).map(mapDuelPreset);
  }

  async createDuel(payload: { duelUsername: string; duelPresetId: number; startTime: string }): Promise<{ id?: number }> {
    const response = await duelsApiClient.createDuel(payload);
    return response;
  }

  async getDuelsRating(params?: { page?: number; pageSize?: number; ordering?: string }): Promise<PageResult<DuelsRatingRow>> {
    const response = await duelsApiClient.listRating(params);
    return mapPageResult(response, mapDuelsRatingRow);
  }
}
