import type { ComponentType } from 'react';
import type { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  ContestProblemEntity,
  ContestProblemInfo,
} from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestTypeInfo } from 'modules/contests/domain/entities/contest.entity';

export type ResultColor = 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';

export interface ContestantProblemResultProps {
  contestType?: ContestType | string;
  typeInfo?: ContestTypeInfo | null;
  info?: ContestProblemInfo | null;
  problem?: ContestProblemEntity;
}

export interface ProblemResultView {
  label: string;
  color: ResultColor;
  helper?: string;
  isBest?: boolean;
}

export type ProblemResultComponent = ComponentType<ContestantProblemResultProps>;
