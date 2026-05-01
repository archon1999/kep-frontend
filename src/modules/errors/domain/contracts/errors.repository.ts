import type { ErrorPageContent } from '../entities';

export interface ErrorsRepository {
  getForbiddenContent: () => ErrorPageContent;
  getNotFoundContent: () => ErrorPageContent;
  getUnexpectedErrorContent: () => ErrorPageContent;
  getStaleClientContent: () => ErrorPageContent;
}
