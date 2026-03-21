import type { ErrorPageContent } from '../entities';

export interface ErrorsRepository {
  getNotFoundContent: () => ErrorPageContent;
}
