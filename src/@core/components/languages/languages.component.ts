import { Component, inject } from '@angular/core';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from "@ng-bootstrap/ng-bootstrap";
import { AppStateService, Language } from "@core/services/app-state.service";

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

  constructor() {
    this.appStateService.state$.subscribe(
      (state) => {
        this.currentLang = state.language;
      }
    )
  }

  setLanguage(lang: Language) {
    this.appStateService.updateState({language: lang});
    location.reload();
  }

  protected readonly Object = Object;
}
