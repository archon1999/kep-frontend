import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  constructor(public api: ApiService) { }

  getStatistics() {
    return this.api.get('landing-page-statistics');
  }

  getReviews() {
    return this.api.get('reviews');
  }

  getFAQ() {
    return this.api.get('faq');
  }

  contactUsSubmit(data: Partial<{ fullName: string, email: string, text: string }>) {
    return this.api.post('contact-us', data);
  }
}
