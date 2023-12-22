import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: '[core-menu-horizontal-item]',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepIconComponent,
  ]
})
export class CoreMenuHorizontalItemComponent {
  @Input()
  item: any;
}
