import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'duel-ready-status-card',
  standalone: true,
  imports: [KepCardComponent, TranslateModule],
  templateUrl: './duel-ready-status-card.component.html',
  styleUrls: ['./duel-ready-status-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelReadyStatusCardComponent {
  @Input() isReady = false;
  @Input() disabled = false;
  @Input() controlId = 'duel-ready-toggle';

  @Output() readyChange = new EventEmitter<boolean>();

  onToggle(value: boolean): void {
    this.readyChange.emit(value);
  }
}
