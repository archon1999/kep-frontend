import { mapAttemptsPage } from 'modules/problems/data-access/mappers/problems.mapper.ts';
import { AttemptListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import {
  DuelCounterPayload,
  PageResult,
  DuelsListParams,
  DuelsRepository,
} from '../../domain/ports/duels.repository.ts';
import {
  Duel,
  DuelInvitation,
  DuelPreset,
  DuelReadyPlayer,
  DuelReadyStatus,
  DuelResults,
  DuelsRatingRow,
} from '../../domain/index.ts';
import { duelsApiClient } from '../api/duels.client.ts';
import {
  mapDuel,
  mapDuelInvitation,
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

  async getDuelResults(id: number | string): Promise<DuelResults> {
    const response = await duelsApiClient.getDuelResults(id);
    return mapDuelResults(response);
  }

  async submitToDuel(
    duelId: number | string,
    payload: { duelProblem: string; sourceCode: string; lang: string },
  ): Promise<void> {
    await duelsApiClient.submitToDuel(duelId, payload);
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

  async getDuelInvitations(params?: { page?: number; pageSize?: number }): Promise<PageResult<DuelInvitation>> {
    const response = await duelsApiClient.listDuelInvitations(params);
    return mapPageResult(response, mapDuelInvitation);
  }

  async createInvitation(payload: {
    duelUsername: string;
    duelPresetId: number;
    startTime: string;
  }): Promise<DuelInvitation> {
    const response = await duelsApiClient.createInvitation(payload);
    return mapDuelInvitation(response);
  }

  async acceptInvitation(id: number): Promise<DuelInvitation> {
    const response = await duelsApiClient.acceptInvitation(id);
    return mapDuelInvitation(response);
  }

  async rejectInvitation(id: number): Promise<DuelInvitation> {
    const response = await duelsApiClient.rejectInvitation(id);
    return mapDuelInvitation(response);
  }

  async counterInvitation(id: number, payload: DuelCounterPayload): Promise<DuelInvitation> {
    const response = await duelsApiClient.counterInvitation(id, payload);
    return mapDuelInvitation(response);
  }

  async getDuelsRating(params?: { page?: number; pageSize?: number; ordering?: string }): Promise<PageResult<DuelsRatingRow>> {
    const response = await duelsApiClient.listRating(params);
    return mapPageResult(response, mapDuelsRatingRow);
  }
}
