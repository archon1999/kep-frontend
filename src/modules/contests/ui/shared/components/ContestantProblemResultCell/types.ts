import type { ComponentType } from 'react';
import {
  ContestProblemEntity,
  ContestProblemInfo,
} from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestTypeInfo } from 'modules/contests/domain/entities/contest.entity';
import type { ContestType } from 'modules/contests/domain/enums/contest.enums';

export type ResultColor = 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';

export interface ContestantProblemResultProps {
  contestType?: ContestType | string;
  typeInfo?: ContestTypeInfo | null;
  info?: ContestProblemInfo | null;
  problem?: ContestProblemEntity;
  rowType?: 'official' | 'upsolve';
}

export interface ProblemResultView {
  label: string;
  color: ResultColor;
  helper?: string;
  isBest?: boolean;
}

export type ProblemResultComponent = ComponentType<ContestantProblemResultProps>;
