import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DuelReadyPlayer } from '@duels/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'duel-ready-player-card',
  standalone: true,
  imports: [KepCardComponent, TranslateModule, UserPopoverModule, NgbTooltip],
  templateUrl: './duel-ready-player-card.component.html',
  styleUrls: ['./duel-ready-player-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelReadyPlayerCardComponent {
  @Input({ required: true }) player!: DuelReadyPlayer;
  @Input() disabled = false;

  @Output() challenge = new EventEmitter<DuelReadyPlayer>();

  onChallenge(): void {
    if (!this.disabled) {
      this.challenge.emit(this.player);
    }
  }
}
