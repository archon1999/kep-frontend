import { Component, inject } from '@angular/core';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from "@ng-bootstrap/ng-bootstrap";
import { AppStateService, Language } from "@core/services/app-state.service";
import { ApiService } from '@core/data-access/api.service';
import { AuthService } from "@auth";

@Component({
  selector: 'languages',
  standalone: true,
  imports: [
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbDropdown
  ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss'
})
export class LanguagesComponent {
  public languages = {
    'en': {
      title: 'English',
      flag: 'us',
    },
    'ru': {
      title: 'Русский язык',
      flag: 'ru',
    },
    'uz': {
      title: 'Oʻzbek tili',
      flag: 'uz',
    },
  };
  public currentLang: Language;

  protected appStateService = inject(AppStateService);
  protected api = inject(ApiService);
  protected authService = inject(AuthService);

  constructor() {
    this.appStateService.state$.subscribe(
      (state) => {
        this.currentLang = state.language;
      }
    )
  }

  setLanguage(lang: Language, reload=true) {
    this.api.post('set-language/', { language: lang }).subscribe(() => {
      this.appStateService.updateState({language: lang});
      if (reload) location.reload();
    })
  }

  protected readonly Object = Object;
}
