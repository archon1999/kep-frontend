import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public get(key: string, defaultReturn = null) {
    return JSON.parse(localStorage.getItem(key)) ?? defaultReturn;
  }

  public set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }

}
