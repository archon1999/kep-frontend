import { useMemo } from 'react';
import { errorsRepository } from '../data-access';
import type { ErrorPageContent } from '../domain';

export const useNotFoundContent = (): ErrorPageContent => {
  return useMemo(() => errorsRepository.getNotFoundContent(), []);
};
