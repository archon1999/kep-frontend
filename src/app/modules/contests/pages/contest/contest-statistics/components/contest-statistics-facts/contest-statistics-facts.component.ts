import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'contest-statistics-facts',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent],
  templateUrl: './contest-statistics-facts.component.html',
  styleUrls: ['./contest-statistics-facts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestStatisticsFactsComponent {
  @Input({ required: true }) facts: string[] = [];
}
