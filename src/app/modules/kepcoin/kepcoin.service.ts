import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class KepcoinService {

  constructor(
    public api: ApiService,
  ) {}

  getUserKepcoinEarns(page = 1) {
    return this.api.get('kepcoin-earns', {page: page});
  }

  getUserKepcoinSpends(page = 1) {
    return this.api.get('kepcoin-spends', {page: page});
  }

  getStreakFreeze() {
    return this.api.get('streak');
  }

}
