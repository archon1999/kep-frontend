import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AttemptLangs } from '../enums';
import { LocalStorageService } from 'app/shared/storages/local-storage.service';

const LANG_KEY = 'problem-submit-lang';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private _currentLang = new BehaviorSubject<AttemptLangs>(
    this.localStorageService.get(LANG_KEY) || AttemptLangs.PYTHON
  );

  constructor(
    public localStorageService: LocalStorageService,
  ){}

  getLanguage(){
    return this._currentLang;
  }

  setLanguage(lang: AttemptLangs){
    this.localStorageService.set(LANG_KEY, lang);
    this._currentLang.next(lang);
  }

}
