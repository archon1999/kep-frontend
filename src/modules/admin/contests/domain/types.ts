import { AdminChoiceOption } from 'modules/admin/shared/domain/types';

export interface AdminContestProblem {
  id?: number;
  problem_id: number;
  problem_title?: string;
  symbol: string;
  ball: number;
  delta?: number | null;
}

export interface AdminContest {
  id: number;
  creator?: number;
  creator_username?: string;
  title: string;
  description?: string;
  description_uz?: string;
  description_en?: string;
  description_ru?: string;
  start_time: string;
  finish_time: string;
  type: string;
  category: number;
  participation_type: number;
  is_rated: boolean;
  private: boolean;
  private_link?: string | null;
  problems: AdminContestProblem[];
  logo_url?: string | null;
  og_image_url?: string | null;
  created?: string;
}

export type AdminContestPayload = Omit<
  AdminContest,
  'id' | 'creator_username' | 'logo_url' | 'og_image_url' | 'created'
>;

export interface AdminContestMeta {
  types: AdminChoiceOption<string>[];
  categories: AdminChoiceOption<number>[];
  participation_types: AdminChoiceOption<number>[];
}
