import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ContestStatisticsOverviewCard } from '../../contest-statistics.models';

@Component({
  selector: 'contest-statistics-overview',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent],
  templateUrl: './contest-statistics-overview.component.html',
  styleUrls: ['./contest-statistics-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestStatisticsOverviewComponent {
  @Input({ required: true }) cards: ContestStatisticsOverviewCard[] = [];
}
