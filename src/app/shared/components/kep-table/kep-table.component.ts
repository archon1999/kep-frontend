import { Component, Input, ViewEncapsulation } from '@angular/core';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'kep-table',
  standalone: true,
  imports: [
    ChallengesUserViewComponent,
    KepPaginationComponent,
    SpinnerComponent,
    EmptyResultComponent,
    KepCardComponent,
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
  @Input() tableClass = '';
  @Input() spinnerHeight = '200px';
  @Input() spinnerColor = '';
}
