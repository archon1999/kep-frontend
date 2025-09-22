import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'contest-statistics-verdicts',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent, ApexChartModule],
  templateUrl: './contest-statistics-verdicts.component.html',
  styleUrls: ['./contest-statistics-verdicts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestStatisticsVerdictsComponent {
  @Input({ required: true }) chart!: ChartOptions;
}
