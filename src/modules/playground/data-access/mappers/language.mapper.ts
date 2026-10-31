import type { PublicLanguage } from 'shared/api/orval/generated/playground/index.schemas';
import type { RunnerLanguage } from '../../domain';

export const toLanguage = (dto: PublicLanguage): RunnerLanguage => ({
  id: dto.lang,
  label: dto.label,
  extension: dto.extension,
  editorLanguage: dto.editorLanguage,
  template: dto.codeTemplate,
  timeLimit: dto.timeLimit,
  memoryLimit: dto.memoryLimit,
});
