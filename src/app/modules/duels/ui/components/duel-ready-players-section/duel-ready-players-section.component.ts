import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DuelReadyPlayer } from '@duels/domain';
import { CoreCommonModule } from '@core/common.module';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { DuelReadyPlayerCardComponent } from '@duels/ui/components/duel-ready-player-card/duel-ready-player-card.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'duel-ready-players-section',
  standalone: true,
  imports: [
    CoreCommonModule,
    EmptyResultComponent,
    KepPaginationComponent,
    DuelReadyPlayerCardComponent,
    KepCardComponent,
  ],
  templateUrl: './duel-ready-players-section.component.html',
  styleUrls: ['./duel-ready-players-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelReadyPlayersSectionComponent {
  @Input() players: DuelReadyPlayer[] = [];
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 12;
  @Input() loading = false;
  @Input() currentUsername: string | null = null;

  @Output() pageChange = new EventEmitter<number>();
  @Output() challenge = new EventEmitter<DuelReadyPlayer>();

  get hasPlayers(): boolean {
    return this.players.length > 0;
  }

  get showPagination(): boolean {
    return this.total > this.pageSize;
  }

  trackPlayer(index: number, player: DuelReadyPlayer): string {
    return player.username;
  }

  isChallengeDisabled(player: DuelReadyPlayer): boolean {
    return !this.currentUsername || this.currentUsername === player.username;
  }

  onChallenge(player: DuelReadyPlayer): void {
    if (!this.isChallengeDisabled(player)) {
      this.challenge.emit(player);
    }
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
