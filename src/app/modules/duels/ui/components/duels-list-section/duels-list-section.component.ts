import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Duel } from '@duels/domain';
import { CoreCommonModule } from '@core/common.module';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { DuelsListCardComponent } from '@duels/ui/components/duels-list-card/duels-list-card.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'duels-list-section',
  standalone: true,
  imports: [
    CoreCommonModule,
    EmptyResultComponent,
    SpinnerComponent,
    KepPaginationComponent,
    DuelsListCardComponent,
    KepCardComponent,
    ResourceByIdPipe,
  ],
  templateUrl: './duels-list-section.component.html',
  styleUrls: ['./duels-list-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelsListSectionComponent {
  @Input() titleKey = 'MyDuels';
  @Input() duels: Duel[] = [];
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() loading = false;
  @Input() confirmLoadingId: number | null = null;
  @Input() currentUsername: string | null = null;

  @Output() pageChange = new EventEmitter<number>();
  @Output() confirm = new EventEmitter<Duel>();

  protected readonly Resources = Resources;

  get hasDuels(): boolean {
    return this.duels.length > 0;
  }

  get showPagination(): boolean {
    return this.total > this.pageSize;
  }

  trackDuel(index: number, duel: Duel): number {
    return duel.id;
  }

  isConfirmAvailable(duel: Duel): boolean {
    return !!this.currentUsername && !duel.isConfirmed && duel.playerSecond?.username === this.currentUsername;
  }

  isConfirmLoading(duel: Duel): boolean {
    return this.confirmLoadingId === duel.id;
  }

  onConfirm(duel: Duel): void {
    if (!this.isConfirmAvailable(duel) || this.isConfirmLoading(duel)) {
      return;
    }

    this.confirm.emit(duel);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
