import type { ErrorPageContent, ErrorsRepository } from '../../domain';

export class ErrorsRepositoryImpl implements ErrorsRepository {
  getNotFoundContent(): ErrorPageContent {
    return {
      title: 'Page not found',
      description: `No worries! Let’s take you back while our bear is searching everywhere`,
      ctaLabel: 'Go Back',
      ctaHref: '/',
    };
  }
}

export const errorsRepository = new ErrorsRepositoryImpl();
