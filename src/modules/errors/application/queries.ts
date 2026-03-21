import { useMemo } from 'react';
import { errorsRepository } from '../data-access';
import type { ErrorPageContent } from '../domain';

export const useNotFoundContent = (): ErrorPageContent => {
  return useMemo(() => errorsRepository.getNotFoundContent(), []);
};

export const useForbiddenContent = (): ErrorPageContent => {
  return useMemo(() => errorsRepository.getForbiddenContent(), []);
};

export const useUnexpectedErrorContent = (): ErrorPageContent => {
  return useMemo(() => errorsRepository.getUnexpectedErrorContent(), []);
};

export const useStaleClientContent = (): ErrorPageContent => {
  return useMemo(() => errorsRepository.getStaleClientContent(), []);
};
