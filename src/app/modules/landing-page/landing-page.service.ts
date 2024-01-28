import { Injectable } from '@angular/core';
import { ApiService } from '@shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  constructor(public api: ApiService) { }

  getStatistics() {
    return this.api.get('landing-page-statistics');
  }
}
