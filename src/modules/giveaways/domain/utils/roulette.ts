import type { Participant } from '../entities/giveaway.types.ts';

export function buildWheel(participants: Participant[], winner: Participant | null) {
  const step = participants.length ? 360 / participants.length : 0;
  const segments = participants.map((person, index) => ({
    person,
    angle: -90 + index * step,
    startAngle: -90 + (index - 0.5) * step,
    endAngle: -90 + (index + 0.5) * step,
  }));
  const winnerIndex = participants.findIndex((person) => person.id === winner?.id);
  const rotation = winnerIndex < 0 ? 0 : 7 * 360 + ((360 - winnerIndex * step) % 360);
  return { segments, rotation };
}

export function remainingSeconds(scheduledAt: string, now: number) {
  return Math.max(0, Math.ceil((Date.parse(scheduledAt) - now) / 1000));
}
