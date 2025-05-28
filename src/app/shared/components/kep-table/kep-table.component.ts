import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'kep-table',
  standalone: true,
  imports: [
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
