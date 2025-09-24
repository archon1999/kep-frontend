import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { RouterModule } from '@angular/router';
import { HighlightCard } from '../../user-statistics.models';

@Component({
  selector: 'contests-user-statistics-highlight-cards',
  standalone: true,
  imports: [CommonModule, TranslateModule, KepCardComponent, KepIconComponent, RouterModule],
  templateUrl: './highlight-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestsUserStatisticsHighlightCardsComponent {
  @Input() cards: HighlightCard[] = [];
}
