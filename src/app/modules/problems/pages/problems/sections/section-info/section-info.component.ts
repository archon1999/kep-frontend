import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepIconComponent,
    ResourceByIdPipe,
  ]
})
export class SectionInfoComponent {
  protected readonly Resources = Resources;
}
