import type { RunResult as RunDto } from 'shared/api/orval/generated/playground/index.schemas';
import type { RunResult } from '../../domain';

export type { RunDto };

export const toRun = (dto: RunDto): RunResult => ({
  id: dto.id,
  status: dto.status,
  verdict: dto.verdict,
  output: dto.output ?? '',
  error: dto.error ?? '',
  time: dto.time ?? 0,
  memory: dto.memory ?? 0,
});
