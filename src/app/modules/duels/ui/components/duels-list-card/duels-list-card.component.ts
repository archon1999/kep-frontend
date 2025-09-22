import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Duel } from '@duels/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { RouterModule } from '@angular/router';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DuelPresetInfoModalComponent } from '@duels/ui/components/duel-preset-info-modal/duel-preset-info-modal.component';

@Component({
  selector: 'duels-list-card',
  standalone: true,
  imports: [
    KepCardComponent,
    TranslateModule,
    UserPopoverModule,
    RouterModule,
    DatePipe,
    NgClass,
    NgIf,
  ],
  templateUrl: './duels-list-card.component.html',
  styleUrls: ['./duels-list-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelsListCardComponent {
  @Input({ required: true }) duel!: Duel;
  @Input() viewLink: any[] = [];
  @Input() confirmAvailable = false;
  @Input() confirmDisabled = false;
  @Input() confirmLoading = false;

  @Output() confirm = new EventEmitter<void>();

  constructor(private readonly modalService: NgbModal) {}

  get statusKey(): string {
    switch (this.duel.status) {
      case -1:
        return 'DuelStatusUpcoming';
      case 0:
        return 'DuelStatusRunning';
      default:
        return 'DuelStatusFinished';
    }
  }

  get statusClass(): string {
    switch (this.duel.status) {
      case -1:
        return 'badge rounded-pill bg-info text-dark';
      case 0:
        return 'badge rounded-pill bg-success';
      default:
        return 'badge rounded-pill bg-secondary';
    }
  }

  onConfirm(): void {
    if (!this.confirmDisabled) {
      this.confirm.emit();
    }
  }

  openPresetModal(): void {
    if (!this.duel.duelPreset) {
      return;
    }

    const modalRef = this.modalService.open(DuelPresetInfoModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.preset = this.duel.duelPreset;
  }
}
