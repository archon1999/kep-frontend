import type {
  ContestReplay,
  ReplayParticipant,
  ReplayProblem,
  ReplayRow,
} from '../../domain/entities/contest-replay.types';

interface ReplayRowDto {
  id: number;
  points: number;
  penalties: number;
  problems: ReplayProblem[];
}

export interface ContestReplayDto {
  available: boolean;
  reason: string | null;
  durationSeconds: number;
  participantsCount: number;
  source: 'history' | 'submissions';
  participants: ({
    id: number;
    name: string;
    country?: string | null;
    isOfficial?: boolean | null;
  } & Omit<Partial<ReplayParticipant>, 'country' | 'isOfficial'>)[];
  problems: string[];
  frames: { at: number; order: number[]; ranks: number[]; changes: ReplayRowDto[] }[];
}

export function mapContestReplay(dto: ContestReplayDto): ContestReplay {
  const participants = new Map(
    dto.participants.map((participant) => [participant.id, participant]),
  );
  const states = new Map<number, ReplayRowDto>();
  return {
    available: dto.available,
    reason: dto.reason,
    durationSeconds: dto.durationSeconds,
    participantsCount: dto.participantsCount,
    source: dto.source,
    problems: dto.problems,
    frames: dto.frames.map((frame) => {
      frame.changes.forEach((row) =>
        states.set(row.id, {
          ...row,
          problems: row.problems.map((problem) => ({ ...problem })),
        }),
      );
      return {
        at: frame.at,
        rows: frame.order.map((id, index): ReplayRow => {
          const state = states.get(id);
          if (!state) throw new Error('Invalid replay frame');
          const profile = participants.get(id);
          return {
            ...state,
            name: profile?.name ?? String(id),
            participant: {
              username: profile?.username ?? profile?.name ?? String(id),
              userFullName: profile?.userFullName,
              ratingTitle: profile?.ratingTitle,
              country: profile?.country ?? undefined,
              isOfficial: profile?.isOfficial ?? undefined,
              isUnrated: profile?.isUnrated,
              team: profile?.team,
            },
            rank: frame.ranks[index],
          };
        }),
      };
    }),
  };
}
