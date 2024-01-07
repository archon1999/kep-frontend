import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  public get(key: string){
    return JSON.parse(sessionStorage.getItem(key));
  }

  public set(key: string, value: any){
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string){
    sessionStorage.removeItem(key);
  }

  public clear(){
    sessionStorage.clear();
  }

}
