import { AdminChoiceOption, AdminIdNameOption } from 'modules/admin/shared/domain/types';

export interface AdminProblemSampleTest {
  id?: number;
  input: string;
  output: string;
}

export interface AdminProblemAvailableLanguage {
  lang: string;
  lang_label?: string;
  time_limit?: number | null;
  memory_limit?: number | null;
  code_template?: string | null;
  code_golf?: number | null;
}

export interface AdminProblem {
  id: number;
  author?: number;
  author_username?: string;
  title: string;
  title_uz?: string;
  title_en?: string;
  title_ru?: string;
  body?: string;
  body_uz?: string;
  body_en?: string;
  body_ru?: string;
  input_data?: string;
  input_data_uz?: string;
  input_data_en?: string;
  input_data_ru?: string;
  output_data?: string;
  output_data_uz?: string;
  output_data_en?: string;
  output_data_ru?: string;
  comment?: string;
  comment_uz?: string;
  comment_en?: string;
  comment_ru?: string;
  difficulty: number;
  problem_rating?: number | null;
  time_limit?: number | null;
  memory_limit?: number | null;
  hidden: boolean;
  partial_solvable: boolean;
  has_checker: boolean;
  has_check_input: boolean;
  sample_tests: AdminProblemSampleTest[];
  available_languages: AdminProblemAvailableLanguage[];
  tags: number[];
  topics: number[];
  image_url?: string | null;
  og_image_url?: string | null;
  created?: string;
  updated?: string;
}

export type AdminProblemPayload = Omit<
  AdminProblem,
  'id' | 'author_username' | 'image_url' | 'og_image_url' | 'created' | 'updated'
>;

export interface AdminProblemMeta {
  difficulties: AdminChoiceOption<number>[];
  languages: AdminChoiceOption<string>[];
  tags: AdminIdNameOption[];
  topics: AdminIdNameOption[];
}
