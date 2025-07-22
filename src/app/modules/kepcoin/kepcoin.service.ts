import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { Pageable } from '@app/common/classes/pageable';

@Injectable({
  providedIn: 'root'
})
export class KepcoinService {

  constructor(
    public api: ApiService,
  ) {}

  getUserKepcoinEarns(params: Partial<Pageable> = {}) {
    return this.api.get('kepcoin-earns', params);
  }

  getUserKepcoinSpends(params: Partial<Pageable> = {}) {
    return this.api.get('kepcoin-spends', params);
  }

  getStreakFreeze() {
    return this.api.get('streak');
  }

}
