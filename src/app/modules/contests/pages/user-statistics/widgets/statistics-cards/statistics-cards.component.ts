import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { StatisticCard } from '../../user-statistics.models';

@Component({
  selector: 'contests-user-statistics-cards',
  standalone: true,
  imports: [CommonModule, TranslateModule, KepCardComponent, KepIconComponent],
  templateUrl: './statistics-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestsUserStatisticsCardsComponent {
  @Input() cards: StatisticCard[] = [];
  @Input() iconClass = '';
  @Input() valueSubtitleInline = false;
  @Input() columnClass = 'col-sm-6 col-xl-3';
}
