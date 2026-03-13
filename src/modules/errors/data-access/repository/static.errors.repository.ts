import type { ErrorPageContent } from '../../domain/entities/error-page.entity';
import type { ErrorsRepository } from '../../domain/ports/errors.repository';

export class StaticErrorsRepository implements ErrorsRepository {
  getNotFoundContent(): ErrorPageContent {
    return {
      title: 'Page not found',
      description: `No worries! Let’s take you back while our bear is searching everywhere`,
      ctaLabel: 'Go Back',
      ctaHref: '/',
    };
  }
}
