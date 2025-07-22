import { Component, inject } from '@angular/core';
import {
  NgbActiveOffcanvas,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLinkButton,
  NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from "ngx-color-picker";
import { AppStateService, StateType } from "@core/services/app-state.service";

type Direction = StateType['direction'];
type NavigationStyles = StateType['navigationStyles'];
type MenuStyles = StateType['menuStyles'];
type LayoutStyles = StateType['layoutStyles'];
type WidthStyles = StateType['widthStyles'];
type MenuPosition = StateType['menuPosition'];
type HeaderPosition = StateType['headerPosition'];
type ThemePrimary = StateType['themePrimary'];

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  standalone: true,
  imports: [
    NgbNavItem,
    ColorPickerModule,
    NgbNavOutlet,
    NgbNav,
    NgbNavContent,
    NgbNavLinkButton
  ]
})
export class SwitcherComponent {
  public localData: StateType;
  // Логика смены основной темы
  defaultPrimary = '#6c5ffc';
  protected activeOffcanvas = inject(NgbActiveOffcanvas);

  constructor(private appStateService: AppStateService) {
    this.appStateService.state$.subscribe((state) => {
      this.localData = state;
    });
  }

  updateDirection(direction: Direction): void {
    this.updateStateProperty('direction', direction);
  }

  updateMenuType(navigationStyles: NavigationStyles): void {
    this.updateStateProperty('navigationStyles', navigationStyles);
    if (navigationStyles === 'horizontal') {
      this.appStateService.updateState({navigationStyles, layoutStyles: '' as any});
      const menuClickElement = document.getElementById('switcher-menu-click') as HTMLInputElement;
      if (menuClickElement) {
        menuClickElement.checked = true;
      }
    }
  }

  updateMenuStyle(menuStyles: MenuStyles): void {
    this.appStateService.updateState({menuStyles, layoutStyles: '' as any});
    this.toggleSlideMenu();
  }

  updateLayoutStyles(layoutStyles: LayoutStyles): void {
    this.appStateService.updateState({layoutStyles, menuStyles: ''});
  }

  updateWidthStyles(widthStyles: WidthStyles): void {
    this.updateStateProperty('widthStyles', widthStyles);
  }

  updateMenuPosition(menuPosition: MenuPosition): void {
    this.updateStateProperty('menuPosition', menuPosition);
  }

  updateHeaderPosition(headerPosition: HeaderPosition): void {
    this.updateStateProperty('headerPosition', headerPosition);
  }

  updatePrimary(themePrimary: ThemePrimary): void {
    this.updateStateProperty('themePrimary', themePrimary);
  }

  updateBgPattern(bgPatternImage: string): void {
    this.updateStateProperty('bgPatternImage', bgPatternImage);
  }

  updateCodingStyle(codingStyles: string): void {
    this.updateStateProperty('codingStyles', codingStyles);
  }

  updateCardBg(cardBackground: string): void {
    this.updateStateProperty('cardBackground', cardBackground);
  }

  updateBgImage(backgroundImage: string): void {
    this.updateStateProperty('backgroundImage', backgroundImage);
  }

  dynamicLightPrimary(data: { color: string }): void {
    this.defaultPrimary = data.color;
    const rgbString = this.hexToRgb(this.defaultPrimary);
    const mainRgb = rgbString;
    const secondaryRgb = rgbString
      .split(',')
      .map((num) => (Number(num.trim()) + 14).toString())
      .join(', ');
    const primaryColor: ThemePrimary = {
      main: mainRgb,
      secondary: secondaryRgb,
      accent: '17, 1, 24',
    };
    this.updatePrimary(primaryColor);
  }

  reset(): void {
    this.appStateService.applyReset();
  }

  private updateStateProperty<K extends keyof StateType>(property: K, value: StateType[K]): void {
    this.appStateService.updateState({[property]: value});
  }

  private toggleSlideMenu(): void {
    const slideMenu = document.querySelector('.slide-menu') as HTMLElement;
    if (slideMenu) {
      const currentDisplay = slideMenu.style.display;
      slideMenu.style.display = currentDisplay.includes('none') ? 'block' : 'none';
    }
  }

  private hexToRgb(hex: string): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((char) => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }
}
