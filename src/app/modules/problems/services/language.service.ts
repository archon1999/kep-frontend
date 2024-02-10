import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AttemptLangs } from '../constants';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';

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
  ) {}

  getLanguage() {
    return this._currentLang;
  }

  getLanguageValue() {
    return this._currentLang.getValue();
  }

  setLanguage(lang: AttemptLangs, eventEmit = true) {
    this.localStorageService.set(LANG_KEY, lang);
    if (eventEmit) {
      this._currentLang.next(lang);
    }
  }

}
