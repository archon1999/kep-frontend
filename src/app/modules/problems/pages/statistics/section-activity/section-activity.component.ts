import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import {
  ProblemsActivityCardComponent
} from '@problems/components/problems-activity-card/problems-activity-card.component';

@Component({
  selector: 'section-activity',
  templateUrl: './section-activity.component.html',
  styleUrls: ['./section-activity.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ProblemsActivityCardComponent,
  ]
})
export class SectionActivityComponent {
  @Input() username: string;
}
