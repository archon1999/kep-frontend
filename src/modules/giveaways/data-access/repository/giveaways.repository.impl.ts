import { instance } from 'shared/api/http/axiosInstance';
import type { GiveawaysRepository } from '../../domain/contracts/giveaways.repository';
import type { GiveawaySummary } from '../../domain/entities/giveaway.types';
import { type GiveawayDto, mapGiveaway } from '../mappers/giveaway.mapper';

async function state(id: string, action?: 'visit' | 'start-animation') {
  const sentAt = Date.now();
  const url = `/api/giveaways/${encodeURIComponent(id)}/${action ? `${action}/` : ''}`;
  const response = action
    ? await instance.post<GiveawayDto>(url)
    : await instance.get<GiveawayDto>(url);
  return mapGiveaway(response.data, sentAt, Date.now());
}

export const giveawaysRepository: GiveawaysRepository = {
  get: (id) => state(id),
  visit: (id) => state(id, 'visit'),
  claimAnimation: (id) => state(id, 'start-animation'),
  list: async (source, id) =>
    (await instance.get<GiveawaySummary[]>('/api/giveaways/', { params: { [source]: id } })).data,
};
