import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import {
  ProblemsActivityCardComponent
} from '@problems/components/problems-activity-card/problems-activity-card.component';
import { LastDaysStatistics } from '@problems/models/statistics.models';

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
  @Input() activity: LastDaysStatistics;
  @Input() allowedDays: number[] = [];
  @Input() days = 7;
  @Output() daysChange = new EventEmitter<number>();
}
