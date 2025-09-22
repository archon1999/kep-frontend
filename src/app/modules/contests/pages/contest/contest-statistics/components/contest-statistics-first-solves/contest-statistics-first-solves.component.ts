import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { ContestStatisticsFirstSolveEntry } from '../../contest-statistics.models';

@Component({
  selector: 'contest-statistics-first-solves',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent, ContestantViewModule, KepTableComponent],
  templateUrl: './contest-statistics-first-solves.component.html',
  styleUrls: ['./contest-statistics-first-solves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestStatisticsFirstSolvesComponent {
  @Input({ required: true }) entries: ContestStatisticsFirstSolveEntry[] = [];
}
