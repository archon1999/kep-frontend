import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ShopApiService {
  constructor(public api: ApiService) { }

  getProducts() {
    return this.api.get('products');
  }
}
