import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';

@Component({
  selector: 'contests-user-statistics-chart-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, KepCardComponent, ApexChartModule],
  templateUrl: './chart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestsUserStatisticsChartCardComponent {
  @Input() titleKey!: string;
  @Input() chart: ChartOptions | null = null;
  @Input() cardHeight?: string;
  @Input() customClass?: string;
  @Input() bodyClass = 'card-body p-2';
  @Input() noDataTranslationKey = 'Contests.UserStatistics.NoData';
  @Input() noDataClass = 'text-center text-muted py-4';
}
