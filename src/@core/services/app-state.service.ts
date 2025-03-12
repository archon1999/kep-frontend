import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { initialState } from "@app/initial-state";

export type Direction = 'ltr' | 'rtl';
export type NavigationStyles = 'vertical' | 'horizontal';
export type MenuStyles = 'menu-click' | 'menu-hover' | 'icon-click' | 'icon-hover' | '';
export type LayoutStyles = 'double-menu' | 'detached' | 'icon-overlay' | 'icontext-menu' | 'closed-menu' | 'default-menu';
export type WidthStyles = 'fullwidth' | 'boxed' | '';
export type MenuPosition = 'fixed' | 'scrollable' | '';
export type HeaderPosition = 'fixed' | 'scrollable' | '';
export type Language = 'uz' | 'ru' | 'en';

interface ThemePrimary {
  main: string;
  secondary: string;
  accent: string;
}

export interface StateType {
  appTitle: string;
  direction: Direction;
  navigationStyles: NavigationStyles;
  menuStyles: MenuStyles;
  layoutStyles: LayoutStyles;
  widthStyles: WidthStyles;
  menuPosition: MenuPosition;
  headerPosition: HeaderPosition;
  themePrimary: ThemePrimary;
  bgPatternImage: string;
  codingStyles: string;
  cardBackground: string;
  themeBackground: string;
  backgroundImage: string;
  language: Language;
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private readonly localStorageKey = 'kep-config';
  private initialState: StateType = initialState;

  private stateSubject = new BehaviorSubject<StateType>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {
    const storedState = this.getInitialStateFromLocalStorage();
    this.initializeState(storedState);
  }

  private getInitialStateFromLocalStorage(): StateType {
    try {
      const storedState = localStorage.getItem(this.localStorageKey);
      if (storedState) {
        return JSON.parse(storedState) as StateType;
      }
    } catch (error) {
      console.error('Error retrieving initial state from local storage:', error);
    }
    return this.initialState;
  }

  private initializeState(state: StateType): void {
    this.applyDirectionSpecificChanges(state.direction);
    this.stateSubject.next(state);
  }

  public updateState(newState?: Partial<StateType>): void {
    const currentState = this.stateSubject.getValue();
    const updatedState: StateType = {...currentState, ...newState};
    this.updateStateAndEmit(updatedState);
  }

  // Вспомогательный геттер для <html>
  private get html(): HTMLElement {
    return document.documentElement;
  }

  private applyPrimarySpecificChanges(primary: ThemePrimary): void {
    this.html.style.setProperty('--primary-rgb', primary.main);
    this.html.style.setProperty('--theme-bg-gradient', primary.secondary);
    this.html.style.setProperty('--light-rgb', primary.accent);
  }

  private applyDirectionSpecificChanges(direction: Direction): void {
    this.html.setAttribute('dir', direction);
  }

  private applyNavigationStylesSpecificChanges(navigationStyles: NavigationStyles): void {
    this.html.setAttribute('data-nav-layout', navigationStyles);
    if (navigationStyles === 'horizontal') {
      this.html.setAttribute('data-nav-style', 'menu-click');
      this.html.removeAttribute('data-vertical-style');
    }
  }

  private applyMenuStylesSpecificChanges(menuStyles: MenuStyles): void {
    this.html.setAttribute('data-nav-style', menuStyles);
    this.html.setAttribute('data-toggled', `${menuStyles}-closed`);
    this.html.removeAttribute('data-vertical-style');

    const childElement = document.querySelector('.child1') as HTMLElement;
    if (this.html.getAttribute('data-nav-style') === 'icon-hover') {
      childElement?.removeAttribute('style');
    } else {
      childElement?.setAttribute('style', 'display: block;');
    }
  }

  private applyLayoutStylesSpecificChanges(layoutStyles: LayoutStyles): void {
    this.html.setAttribute('data-vertical-style', layoutStyles);
    this.html.removeAttribute('data-nav-style');

    switch (layoutStyles) {
      case 'default-menu':
        this.html.setAttribute('data-vertical-style', 'overlay');
        this.html.removeAttribute('data-toggled');
        break;
      case 'closed-menu':
        this.html.setAttribute('data-toggled', 'close-menu-close');
        break;
      case 'icontext-menu':
        this.html.setAttribute('data-toggled', 'icon-text-close');
        break;
      case 'icon-overlay':
        this.html.setAttribute('data-toggled', 'icon-overlay-close');
        break;
      case 'detached':
        this.html.setAttribute('data-toggled', 'detached-close');
        break;
      case 'double-menu':
        this.html.setAttribute('data-toggled', 'double-menu-open');
        break;
    }
    if (layoutStyles === 'icontext-menu') {
      this.html.setAttribute('icon-text', 'open');
    } else {
      this.html.removeAttribute('icon-text');
    }
  }

  private applyWidthStylesSpecificChanges(widthStyles: WidthStyles): void {
    this.html.setAttribute('data-width', widthStyles);
  }

  private applyMenuPositionSpecificChanges(menuPosition: MenuPosition): void {
    this.html.setAttribute('data-menu-position', menuPosition);
  }

  private applyHeaderPositionSpecificChanges(headerPosition: HeaderPosition): void {
    this.html.setAttribute('data-header-position', headerPosition);
  }

  private applyBackgroundPatternSpecificChanges(bgPatternImage: string): void {
    this.html.setAttribute('data-pattern-img', bgPatternImage);
  }

  private applyCodingStyleSpecificChanges(codingStyles: string): void {
    this.html.setAttribute('data-card-style', codingStyles);
  }

  private applyCardBackgroundSpecificChanges(cardBackground: string): void {
    this.html.setAttribute('data-card-background', cardBackground);
  }

  private applyBackgroundImageSpecificChanges(backgroundImage: string): void {
    this.html.setAttribute('data-bg-img', backgroundImage);
  }

  public applyReset(): void {
    this.resetHtmlAttributes([
      'style',
      'data-bg-img',
      'data-pattern-img',
      'data-menu-position',
      'data-header-position',
      'data-width',
      'data-card-background',
      'data-vertical-style',
    ]);
    this.html.setAttribute('data-toggled', 'close');
    this.html.setAttribute('data-card-style', 'style1');
    this.html.setAttribute('dir', 'ltr');
    this.html.setAttribute('data-vertical-style', 'detached');

    const mainMenu = document.querySelector('.main-menu') as HTMLElement;
    mainMenu?.removeAttribute('style');
    const slideMenu = document.querySelector('.slide-menu') as HTMLElement;
    slideMenu?.removeAttribute('style');

    this.stateSubject.next(this.initialState);
    this.updateStateAndEmit(this.initialState);
    localStorage.clear();

    const bgPattern = document.getElementById('switcher-pattern-img3') as HTMLInputElement;
    if (bgPattern) { bgPattern.checked = true; }
    const codingStyle = document.getElementById('switcher-card-style') as HTMLInputElement;
    if (codingStyle) { codingStyle.checked = true; }
    const cardBg = document.getElementById('switcher-card-background') as HTMLInputElement;
    if (cardBg) { cardBg.checked = true; }
  }

  public applyReset1(): void {
    this.resetHtmlAttributes([
      'style',
      'data-bg-img',
      'data-pattern-img',
      'data-menu-position',
      'data-header-position',
      'data-width',
    ]);
    this.html.setAttribute('data-toggled', 'close');
    this.html.setAttribute('data-card-style', 'style1');
    this.html.setAttribute('dir', 'ltr');
    this.html.setAttribute('data-nav-layout', 'horizontal');
    this.html.setAttribute('data-card-background', 'background1');
    this.html.setAttribute('data-vertical-style', 'detached');

    this.stateSubject.next(this.initialState);
    localStorage.clear();
  }

  public getCurrentValue() {
    return this.stateSubject.getValue();
  }

  private resetHtmlAttributes(attributes: string[]): void {
    attributes.forEach(attr => this.html.removeAttribute(attr));
  }

  private updateStateAndEmit(state: StateType): void {
    if (state.direction) {
      this.applyDirectionSpecificChanges(state.direction);
    }
    if (state.navigationStyles) {
      this.applyNavigationStylesSpecificChanges(state.navigationStyles);
    }
    if (state.menuStyles && !state.layoutStyles) {
      this.applyMenuStylesSpecificChanges(state.menuStyles);
    }
    if (state.layoutStyles && !state.menuStyles) {
      this.applyLayoutStylesSpecificChanges(state.layoutStyles);
    }
    if (state.widthStyles) {
      this.applyWidthStylesSpecificChanges(state.widthStyles);
    }
    if (state.menuPosition) {
      this.applyMenuPositionSpecificChanges(state.menuPosition);
    }
    if (state.headerPosition) {
      this.applyHeaderPositionSpecificChanges(state.headerPosition);
    }
    if (state.themePrimary) {
      this.applyPrimarySpecificChanges(state.themePrimary);
    }
    if (state.bgPatternImage) {
      this.applyBackgroundPatternSpecificChanges(state.bgPatternImage);
    }
    if (state.codingStyles) {
      this.applyCodingStyleSpecificChanges(state.codingStyles);
    }
    if (state.cardBackground) {
      this.applyCardBackgroundSpecificChanges(state.cardBackground);
    }
    if (state.backgroundImage) {
      this.applyBackgroundImageSpecificChanges(state.backgroundImage);
    }
    this.stateSubject.next(state);
    this.updateLocalStorage(state);
  }

  private updateLocalStorage(state: StateType): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to local storage:', error);
    }
  }
}
