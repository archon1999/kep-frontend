import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';

@Component({
  selector: 'kep-table',
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewComponent,
    KepPaginationComponent,
    SpinnerComponent,
    EmptyResultComponent,
  ],
  templateUrl: './kep-table.component.html',
  styleUrl: './kep-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class KepTableComponent {
  @Input() loading: boolean;
  @Input() error: boolean;
  @Input() empty: boolean;
  @Input() cardClass = 'card';
  @Input() tableCardClass = 'beautiful-table';
  @Input() tableClass = 'table-striped';
  @Input() spinnerHeight = '200px';
  @Input() spinnerColor = 'var(--contest-color)';
}
