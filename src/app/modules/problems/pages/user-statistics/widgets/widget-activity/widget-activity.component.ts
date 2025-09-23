import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import {
  ProblemsActivityCardComponent
} from '@problems/components/problems-activity-card/problems-activity-card.component';

@Component({
  selector: 'widget-activity',
  templateUrl: './widget-activity.component.html',
  styleUrls: ['./widget-activity.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ProblemsActivityCardComponent,
  ]
})
export class WidgetActivityComponent {
  @Input() solved = 0;
  @Input() series: number[] = [];
  @Input() selectedDays = 7;
  @Input() allowedDays: number[] = [];
  @Output() daysChange = new EventEmitter<number>();
}
