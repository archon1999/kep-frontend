import type { Giveaway, GiveawaySummary, Participant } from '../../domain/entities/giveaway.types';

export type GiveawayDto = GiveawaySummary & {
  status: 'scheduled' | 'finished';
  participants: Participant[];
  winner: Participant | null;
  isCandidate: boolean;
  isEntered: boolean;
  animationSeen: boolean;
  shouldAnimate: boolean;
  animationDurationMs: number;
  serverTime: string;
};

export const mapGiveaway = (dto: GiveawayDto, sentAt: number, receivedAt: number): Giveaway => ({
  ...dto,
  participants: dto.participants.map((user) => ({ id: user.id, username: user.username })),
  serverOffsetMs: Date.parse(dto.serverTime) - (sentAt + receivedAt) / 2,
});
