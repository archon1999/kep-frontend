import { Injectable } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';

@Injectable({
  providedIn: 'root'
})
export class ShopApiService {
  constructor(public api: ApiService) { }

  getProducts() {
    return this.api.get('products');
  }
}
