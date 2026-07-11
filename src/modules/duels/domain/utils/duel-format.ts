import type { DuelPreset } from '../entities/duel.entity.ts';

export const formatDuelDuration = (value?: string | null) => {
  if (!value) return '';

  const [hours = 0, minutes = 0, seconds = 0] = value.split(':').map(Number);
  if ([hours, minutes, seconds].some(Number.isNaN)) return value;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!hours && !minutes && seconds) parts.push(`${seconds}s`);
  return parts.join(' ') || value;
};

export const getDuelPresetCategoryTitle = (preset?: DuelPreset | null) => {
  if (!preset?.category) return '';
  return typeof preset.category === 'string' ? preset.category : (preset.category.title ?? '');
};
