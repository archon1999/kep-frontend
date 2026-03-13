import { useMemo } from 'react';
import { StaticErrorsRepository } from '../data-access/repository/static.errors.repository';
import type { ErrorPageContent } from '../domain/entities/error-page.entity';

const repository = new StaticErrorsRepository();

export const useNotFoundContent = (): ErrorPageContent => {
  return useMemo(() => repository.getNotFoundContent(), []);
};
