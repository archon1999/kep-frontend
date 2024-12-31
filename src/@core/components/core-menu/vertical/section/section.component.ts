import { Component, Input } from '@angular/core';

import { CoreMenuItem } from '../../../../types';
import { CoreCommonModule } from '../../../../common.module';

@Component({
  selector: '[core-menu-vertical-section]',
  templateUrl: './section.component.html',
  standalone: true,
  imports: [
    CoreCommonModule,
  ]
})
export class CoreMenuVerticalSectionComponent {
  @Input()
  item: CoreMenuItem;
}
