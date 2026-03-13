import type { ErrorPageContent } from '../entities/error-page.entity';

export interface ErrorsRepository {
  getNotFoundContent: () => ErrorPageContent;
}
