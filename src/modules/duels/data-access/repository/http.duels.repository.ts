import { mapAttemptsPage } from 'modules/problems/data-access/mappers/problems.mapper.ts';
import { AttemptListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import {
  DuelAcceptPayload,
  DuelCallsParams,
  DuelCounterPayload,
  PageResult,
  DuelsListParams,
  DuelsRatingParams,
  DuelsRepository,
} from '../../domain/ports/duels.repository.ts';
import {
  Duel,
  DuelInvitation,
  DuelPreset,
  DuelTypeInfo,
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
  mapDuelTypeInfo,
  mapPageResult,
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

  async getDuelPresets(): Promise<DuelPreset[]> {
    const response = await duelsApiClient.listDuelPresets();
    const data = Array.isArray(response?.data) ? response.data : response;
    return (data ?? []).map(mapDuelPreset);
  }

  async getDuelTypes(): Promise<DuelTypeInfo[]> {
    const response = await duelsApiClient.listDuelTypes();
    const data = Array.isArray(response?.data) ? response.data : response;
    return (data ?? []).map(mapDuelTypeInfo);
  }

  async getDuelCalls(params?: DuelCallsParams): Promise<PageResult<DuelInvitation>> {
    const response = await duelsApiClient.listDuelCalls(params);
    return mapPageResult(response, mapDuelInvitation);
  }

  async createDuelCall(payload: {
    duelPresetId: number;
    duelTypeId: number;
  }): Promise<DuelInvitation> {
    const response = await duelsApiClient.createDuelCall(payload);
    return mapDuelInvitation(response);
  }

  async acceptDuelCall(id: number, payload: DuelAcceptPayload): Promise<DuelInvitation> {
    const response = await duelsApiClient.acceptDuelCall(id, payload);
    return mapDuelInvitation(response);
  }

  async confirmDuelCall(id: number): Promise<DuelInvitation> {
    const response = await duelsApiClient.confirmDuelCall(id);
    return mapDuelInvitation(response);
  }

  async rejectDuelCall(id: number): Promise<DuelInvitation> {
    const response = await duelsApiClient.rejectDuelCall(id);
    return mapDuelInvitation(response);
  }

  async cancelDuelCall(id: number): Promise<DuelInvitation> {
    const response = await duelsApiClient.cancelDuelCall(id);
    return mapDuelInvitation(response);
  }

  async counterDuelCall(id: number, payload: DuelCounterPayload): Promise<DuelInvitation> {
    const response = await duelsApiClient.counterDuelCall(id, payload);
    return mapDuelInvitation(response);
  }

  async getDuelsRating(params?: DuelsRatingParams): Promise<PageResult<DuelsRatingRow>> {
    const response = await duelsApiClient.listRating(params);
    return mapPageResult(response, mapDuelsRatingRow);
  }
}
