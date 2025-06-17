import { Component } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepIconComponent,
  ]
})
export class SectionInfoComponent {}
