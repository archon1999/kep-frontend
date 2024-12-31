import { Component, ViewEncapsulation } from '@angular/core';
import { coreConfig } from '@app/app.config';
import { menu } from '../menu/menu';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
  protected readonly coreConfig = coreConfig;
  protected readonly menu = menu;
}
