import { useAuth } from 'app/providers/AuthProvider';
import type { ProblemDetail } from '../../domain/entities/problem.entity';
import { parseProblemPermissions } from '../../domain/utils/problem-permissions';
import { usePersistedCode } from './usePersistedCode';
import { useProblemExecution } from './useProblemExecution';
import { useProblemLanguage } from './useProblemLanguage';

type Options = {
  problem?: ProblemDetail;
  storageKey: string | null;
  scope: string;
  locked?: boolean;
  allowAnswer?: boolean;
};

export const useProblemWorkspace = ({
  problem,
  storageKey,
  scope,
  locked,
  allowAnswer,
}: Options) => {
  const { currentUser } = useAuth();
  const language = useProblemLanguage({
    availableLanguages: problem?.availableLanguages,
    defaultLang: problem?.availableLanguages?.[0]?.lang,
  });
  const draft = usePersistedCode({
    storageKey,
    template: language.selectedLanguage?.codeTemplate || '',
  });
  const execution = useProblemExecution({
    problem,
    scope,
    selectedLang: language.selectedLang,
    codeRef: draft.codeRef,
    locked,
    allowAnswer,
  });
  const permissions = parseProblemPermissions(currentUser?.permissions);
  return {
    ...language,
    ...draft,
    ...execution,
    canUseCheckSamples: Boolean(permissions.canUseCheckSamples || currentUser?.isSuperuser),
  };
};
