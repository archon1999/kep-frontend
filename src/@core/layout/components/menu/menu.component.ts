import { Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { HorizontalMenuComponent } from '@layout/components/menu/horizontal-menu/horizontal-menu.component';
import { VerticalMenuComponent } from '@layout/components/menu/vertical-menu/vertical-menu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    HorizontalMenuComponent,
    VerticalMenuComponent,
  ]
})
export class MenuComponent {
  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    this._menuType = 'horizontal-menu';
  }

  private _menuType: string;

  get menuType(): string {
    return this._menuType;
  }

  @Input()
  set menuType(value: string) {
    this._renderer.removeClass(this._elementRef.nativeElement, this.menuType);
    this._menuType = value;
    this._renderer.addClass(this._elementRef.nativeElement, value);
  }
}
