import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseComponent } from '@app/common/classes/base.component';

@Component({
  selector: 'section-get-started',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-get-started.component.html',
  styleUrl: './section-get-started.component.scss'
})
export class SectionGetStartedComponent extends BaseComponent {
}
