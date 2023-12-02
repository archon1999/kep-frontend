import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';

@Component({
  selector: 'kep-table',
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewModule,
    KepPaginationComponent,
    SpinnerComponent,
    EmptyResultComponent,
  ],
  templateUrl: './kep-table.component.html',
  styleUrl: './kep-table.component.scss'
})
export class KepTableComponent {
  @Input() loading: boolean;
  @Input() error: boolean;
  @Input() empty: boolean;
  @Input() color = 'primary';
  @Input() cardClass = 'card';
  @Input() tableClass = 'beautiful-table';
}
