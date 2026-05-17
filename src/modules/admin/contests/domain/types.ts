import { AdminChoiceOption } from 'modules/admin/shared/helpers/types.ts';

export interface AdminContestProblem {
  id?: number;
  problemId: number;
  problemTitle?: string;
  symbol: string;
  ball: number;
  delta?: number | null;
}

export interface AdminContest {
  id: number;
  creator?: number;
  creatorUsername?: string;
  title: string;
  description?: string;
  descriptionUz?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  startTime: string;
  finishTime: string;
  type: string;
  category: number;
  participationType: number;
  isRated: boolean;
  private: boolean;
  privateLink?: string | null;
  problems: AdminContestProblem[];
  logoUrl?: string | null;
  ogImageUrl?: string | null;
  created?: string;
}

export type AdminContestPayload = Omit<
  AdminContest,
  'id' | 'creatorUsername' | 'logoUrl' | 'ogImageUrl' | 'created'
>;

export interface AdminContestMeta {
  types: AdminChoiceOption<string>[];
  categories: AdminChoiceOption<number>[];
  participationTypes: AdminChoiceOption<number>[];
}
