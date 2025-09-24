import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { ContestCard } from '../../user-statistics.models';

type NgClassValue = string | string[] | Set<string> | { [klass: string]: unknown } | null;

@Component({
  selector: 'contests-user-statistics-contest-cards',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, KepCardComponent, KepIconComponent],
  templateUrl: './contest-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestsUserStatisticsContestCardsComponent {
  @Input() titleKey!: string;
  @Input() cards: ContestCard[] = [];
  @Input() valueClassFn: ((card: ContestCard) => NgClassValue) | null = null;

  public getValueClass(card: ContestCard): NgClassValue {
    return this.valueClassFn ? this.valueClassFn(card) : null;
  }
}
