import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';

const PREFIX = 'template-code';

@Injectable({
  providedIn: 'root'
})
export class TemplateCodeService {

  constructor(public localStorageService: LocalStorageService) { }

  save(uniqueName: string, lang: string, templateCode: string) {
    this.localStorageService.set(this._getKey(uniqueName, lang), templateCode);
  }

  get(uniqueName: string, lang: string,) {
    return this.localStorageService.get(this._getKey(uniqueName, lang)) || '';
  }

  private _getKey(uniqueName: string, lang: string) {
    return PREFIX + '-' + uniqueName + '-' + lang;
  }

}
