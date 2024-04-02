import { Injectable } from '@angular/core';
import { deepEquals } from '@shared/utils/deep-equals';

const TIMEOUT = 10000;

interface CacheData {
  url: string;
  params: any;
  data: any;
  time: number;
}

@Injectable({
  providedIn: 'root'
})
export class HttpCachingService {
  private _cache: CacheData[] = [];

  add(url: string, params: any, data: any) {
    if (this.has(url, params)) {
      this.remove(url, params);
    }
    this._cache.push({
      url: url,
      params: params,
      data: data,
      time: Date.now(),
    });
  }

  has(url: string, params: any) {
    return !!this.get(url, params);
  }

  get(url: string, params: any) {
    this._update();
    return this._cache.find((value) => value.url === url && deepEquals(value.params, params))?.data;
  }

  remove(url: string, params: any) {
    this._cache = this._cache.filter(value => value.url !== url || value.params !== params);
  }

  clear() {
    this._cache = [];
  }

  private _update() {
    this._cache = this._cache.filter(value => Date.now() - value.time <= TIMEOUT);
  }
}
