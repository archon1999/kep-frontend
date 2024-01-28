import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { Resources } from '@app/resources';
import { BaseComponent } from '@shared/components/classes/base.component';

@Component({
  selector: 'section-get-started',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-get-started.component.html',
  styleUrl: './section-get-started.component.scss'
})
export class SectionGetStartedComponent extends BaseComponent {
}
