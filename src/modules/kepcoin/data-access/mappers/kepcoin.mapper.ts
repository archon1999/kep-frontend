import type {
  ApiKepcoinEarnsList200,
  ApiKepcoinSpendsList200,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import type {
  KepcoinEarnHistoryItem,
  KepcoinHistoryResponse,
  KepcoinSpendHistoryItem,
} from '../../domain/entities/kepcoin.entity';
import { KepcoinEarnType, KepcoinSpendType } from '../../domain/entities/kepcoin.entity';

const parseDetail = (detail: unknown): unknown => {
  if (typeof detail !== 'string') {
    return detail ?? null;
  }

  const trimmed = detail.trim();
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return detail;
    }
  }

  return detail;
};

const createHistoryItemId = (
  prefix: 'earn' | 'spend',
  item: { datetime?: string | null; note?: string | null; detail?: unknown; amount: number },
  index: number,
) => {
  return [
    prefix,
    item.datetime ?? 'unknown',
    item.amount,
    item.note ?? 'note',
    typeof item.detail === 'string' ? item.detail : '',
    index,
  ]
    .filter(Boolean)
    .join('-');
};

export const mapApiEarnHistoryToDomain = (
  response: ApiKepcoinEarnsList200,
): KepcoinHistoryResponse<KepcoinEarnHistoryItem> => ({
  items: response.data.map((item, index) => ({
    id: createHistoryItemId('earn', { datetime: item.datetime, note: item.note, detail: item.detail, amount: item.kepcoin }, index),
    amount: item.kepcoin,
    happenedAt: item.datetime ?? null,
    note: item.note ?? null,
    detail: parseDetail(item.detail),
    earnType: item.earnType as KepcoinEarnType,
  })),
  total: response.total,
  page: response.page,
  pageSize: response.pageSize,
  pagesCount: response.pagesCount,
});

export const mapApiSpendHistoryToDomain = (
  response: ApiKepcoinSpendsList200,
): KepcoinHistoryResponse<KepcoinSpendHistoryItem> => ({
  items: response.data.map((item, index) => ({
    id: createHistoryItemId('spend', { datetime: item.datetime, note: item.note, detail: item.detail, amount: item.kepcoin }, index),
    amount: item.kepcoin,
    happenedAt: item.datetime ?? null,
    note: item.note ?? null,
    detail: parseDetail(item.detail),
    spendType: item.type as KepcoinSpendType,
  })),
  total: response.total,
  page: response.page,
  pageSize: response.pageSize,
  pagesCount: response.pagesCount,
});
