import type { ErrorPageContent, ErrorsRepository } from '../../domain';

export class ErrorsRepositoryImpl implements ErrorsRepository {
  getForbiddenContent(): ErrorPageContent {
    return {
      title: 'Access denied',
      description: 'You do not have permission to open this page.',
      ctaLabel: 'Go Back',
      ctaHref: '/',
    };
  }

  getNotFoundContent(): ErrorPageContent {
    return {
      title: 'Page not found',
      description: "No worries! Let's take you back while our bear is searching everywhere.",
      ctaLabel: 'Go Back',
      ctaHref: '/',
    };
  }

  getUnexpectedErrorContent(): ErrorPageContent {
    return {
      title: 'Kutilmagan xatolik yuz berdi',
      description:
        "Sahifa ishlash vaqtida xatolik berdi. Sahifani qayta yuklab ko'ring, muammo davom etsa birozdan keyin yana urinib ko'ring.",
      ctaLabel: 'Sahifani qayta yuklash',
      ctaHref: '/',
    };
  }

  getStaleClientContent(): ErrorPageContent {
    return {
      title: 'Loyiha yangilandi',
      description:
        "Saytning yangi versiyasi deploy qilindi. Eng so'nggi fayllarni olish uchun sahifani qayta yuklang.",
      ctaLabel: 'Qayta yuklash',
      ctaHref: '/',
    };
  }
}

export const errorsRepository = new ErrorsRepositoryImpl();
