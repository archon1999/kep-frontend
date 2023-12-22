import { Component, Input } from '@angular/core';

import { CoreMenuItem } from 'core/types';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: '[core-menu-vertical-item]',
  templateUrl: './item.component.html',
  standalone: true,
  imports: [
    CoreCommonModule,
    KepIconComponent,
  ]
})
export class CoreMenuVerticalItemComponent {
  @Input()
  item: CoreMenuItem;
}
