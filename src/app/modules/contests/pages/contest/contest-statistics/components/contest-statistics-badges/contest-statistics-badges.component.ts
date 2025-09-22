import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ContestStatisticsBadgeCard } from '../../contest-statistics.models';

@Component({
  selector: 'contest-statistics-badges',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent, ContestantViewModule],
  templateUrl: './contest-statistics-badges.component.html',
  styleUrls: ['./contest-statistics-badges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestStatisticsBadgesComponent {
  @Input({ required: true }) badges: ContestStatisticsBadgeCard[] = [];
}
