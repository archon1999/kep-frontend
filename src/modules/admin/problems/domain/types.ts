import { AdminChoiceOption, AdminIdNameOption } from 'modules/admin/shared/helpers/types.ts';

export interface AdminProblemSampleTest {
  id?: number;
  input: string;
  output: string;
}

export interface AdminProblemAvailableLanguage {
  lang: string;
  langLabel?: string;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  codeTemplate?: string | null;
  codeGolf?: number | null;
}

export interface AdminProblem {
  id: number;
  author?: number;
  authorUsername?: string;
  title: string;
  titleUz?: string;
  titleEn?: string;
  titleRu?: string;
  body?: string;
  bodyUz?: string;
  bodyEn?: string;
  bodyRu?: string;
  inputData?: string;
  inputDataUz?: string;
  inputDataEn?: string;
  inputDataRu?: string;
  outputData?: string;
  outputDataUz?: string;
  outputDataEn?: string;
  outputDataRu?: string;
  comment?: string;
  commentUz?: string;
  commentEn?: string;
  commentRu?: string;
  difficulty: number;
  problemRating?: number | null;
  solvedCount?: number;
  unsolvedCount?: number;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  hidden: boolean;
  partialSolvable: boolean;
  hasChecker: boolean;
  hasCheckInput: boolean;
  sampleTests: AdminProblemSampleTest[];
  availableLanguages: AdminProblemAvailableLanguage[];
  tags: number[];
  topics: number[];
  groups: number[];
  imageUrl?: string | null;
  ogImageUrl?: string | null;
  created?: string;
  updated?: string;
}

export type AdminProblemPayload = Omit<
  AdminProblem,
  'id' | 'authorUsername' | 'imageUrl' | 'ogImageUrl' | 'created' | 'updated'
>;

export interface AdminProblemMeta {
  difficulties: AdminChoiceOption<number>[];
  languages: AdminChoiceOption<string>[];
  tags: AdminIdNameOption[];
  topics: AdminIdNameOption[];
  groups: Array<AdminIdNameOption & { parent?: number | null }>;
}
