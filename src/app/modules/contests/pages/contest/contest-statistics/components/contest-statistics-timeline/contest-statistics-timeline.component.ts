import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'contest-statistics-timeline',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent, ApexChartModule],
  templateUrl: './contest-statistics-timeline.component.html',
  styleUrls: ['./contest-statistics-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestStatisticsTimelineComponent {
  @Input({ required: true }) totalAttempts!: number;
  @Input({ required: true }) chart!: ChartOptions;
}
