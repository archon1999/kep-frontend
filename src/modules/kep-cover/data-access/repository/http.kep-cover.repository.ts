import { KepCoverRepository, PageResult } from '../../domain/ports/kep-cover.repository';
import { KepCoverContestSummary, KepCoverEntry, KepCoverVoteState } from '../../domain/entities/kep-cover.entity';
import { kepCoverApiClient } from '../api/kep-cover.client';
import { mapKepCoverPage, mapKepCoverSummary, mapKepCoverVoteState } from '../mappers/kep-cover.mapper';

export class HttpKepCoverRepository implements KepCoverRepository {
  async getSummary(): Promise<KepCoverContestSummary> {
    const result = await kepCoverApiClient.summary();
    return mapKepCoverSummary(result);
  }

  async getEntries(params?: { page?: number; pageSize?: number }): Promise<PageResult<KepCoverEntry>> {
    const result = await kepCoverApiClient.entries(params);
    return mapKepCoverPage(result);
  }

  async vote(entryId: number | string): Promise<KepCoverVoteState> {
    const result = await kepCoverApiClient.vote(entryId);
    return mapKepCoverVoteState(result);
  }
}
