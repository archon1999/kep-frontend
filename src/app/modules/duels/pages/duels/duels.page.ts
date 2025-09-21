import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { DuelsService } from '../../duels.service';
import { Duel, DuelPreset, DuelReadyPlayer } from '../../duels.interfaces';
import { PageResult } from '@core/common/classes/page-result';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { EmptyResultComponent } from "@shared/components/empty-result/empty-result.component";

@Component({
  selector: 'page-duels',
  standalone: true,
  templateUrl: './duels.page.html',
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    KepPaginationComponent,
    NgbModalModule,
    SpinnerComponent,
    TranslateModule,
    UserPopoverModule,
    RouterModule,
    DatePipe,
    KepCardComponent,
    EmptyResultComponent,
  ]
})
export class DuelsPage extends BasePageComponent implements OnInit {
  @ViewChild('duelPresetModal') duelPresetModal: TemplateRef<any>;
  isReady = false;
  readyStatusLoading = false;
  readyPlayersPage = 1;
  readyPlayersPageSize = 12;
  readyPlayersResult: PageResult<DuelReadyPlayer> | null = null;
  readyPlayersLoading = false;
  duelsPage = 1;
  duelsPageSize = 10;
  duelsResult: PageResult<Duel> | null = null;
  duelsLoading = false;
  duelPresets: DuelPreset[] = [];
  duelPresetsLoading = false;
  selectedOpponent: DuelReadyPlayer | null = null;
  confirmLoadingId: number | null = null;
  protected duelsService = inject(DuelsService);
  private fb = inject(FormBuilder);
  duelForm = this.fb.group({
    presetId: [null as number | null, Validators.required],
    startTime: ['', Validators.required],
  });
  private modalRef: NgbModalRef | null = null;

  get duelControls() {
    return this.duelForm.controls;
  }

  get readyPlayersTotal(): number {
    return this.readyPlayersResult?.total || 0;
  }

  get duelsTotal(): number {
    return this.duelsResult?.total || 0;
  }

  get minStartTime(): string {
    return this.formatDateInput(new Date());
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadReadyStatus();
    this.loadReadyPlayers();
  }

  override afterChangeCurrentUser(): void {
    if (this.currentUser) {
      this.loadDuels();
    } else {
      this.duelsResult = null;
    }
  }

  onReadyStatusChange(ready: boolean): void {
    if (this.readyStatusLoading) {
      return;
    }

    const previous = this.isReady;
    this.isReady = ready;
    this.readyStatusLoading = true;
    this.duelsService.updateReadyStatus(ready)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.readyStatusLoading = false),
      )
      .subscribe({
        next: status => {
          this.isReady = status?.ready ?? ready;
          this.loadReadyPlayers();
        },
        error: () => {
          this.isReady = previous;
        }
      });
  }

  loadReadyStatus(): void {
    this.readyStatusLoading = true;
    this.duelsService.getReadyStatus()
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.readyStatusLoading = false;
        })
      )
      .subscribe({
        next: status => this.isReady = status?.ready ?? false,
        error: () => this.isReady = false,
      });
  }

  loadReadyPlayers(page?: number): void {
    if (page) {
      this.readyPlayersPage = page;
    }
    this.readyPlayersLoading = true;
    this.duelsService.getReadyPlayers({
      page: this.readyPlayersPage,
      page_size: this.readyPlayersPageSize,
    })
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.readyPlayersLoading = false)
      )
      .subscribe({
        next: result => this.readyPlayersResult = result,
        error: () => this.readyPlayersResult = null,
      });
  }

  loadDuels(page?: number): void {
    if (!this.currentUser) {
      return;
    }

    if (page) {
      this.duelsPage = page;
    }

    this.duelsLoading = true;
    this.duelsService.getDuels({
      page: this.duelsPage,
      page_size: this.duelsPageSize,
      username: this.currentUser.username,
    })
      .pipe(
        takeUntil(this._unsubscribeAll),
      )
      .subscribe({
        next: result => {
          this.duelsLoading = false;
          this.duelsResult = result;
          this.cdr.markForCheck();
        },
        error: () => this.duelsResult = null,
      });
  }

  openDuelModal(opponent: DuelReadyPlayer): void {
    this.selectedOpponent = opponent;
    this.duelPresets = [];
    this.duelPresetsLoading = true;
    const startTime = this.defaultStartTime();
    this.duelForm.reset({
      presetId: null,
      startTime: this.formatDateInput(startTime),
    });
    this.modalRef = this.modalService.open(this.duelPresetModal, {
      size: 'lg',
      centered: true,
    });
    this.modalRef.result.finally(() => {
      this.modalRef = null;
      this.selectedOpponent = null;
    });
    this.duelsService.getDuelPresets(opponent.username)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.duelPresetsLoading = false)
      )
      .subscribe({
        next: presets => this.duelPresets = presets || [],
        error: () => this.duelPresets = [],
      });
  }

  closeModal(): void {
    this.modalRef?.close();
    this.modalRef = null;
    this.selectedOpponent = null;
  }

  createDuel(): void {
    if (!this.selectedOpponent) {
      return;
    }

    if (this.duelForm.invalid) {
      this.duelForm.markAllAsTouched();
      return;
    }

    const {presetId, startTime} = this.duelForm.value;
    this.duelsService.createDuel({
      duel_username: this.selectedOpponent.username,
      duel_preset: presetId!,
      start_time: this.toBackendDate(startTime as string),
    })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: response => {
          this.toastr.success(this.translateService.instant('DuelCreated'), this.translateService.instant('Successfully'));
          this.closeModal();
          this.loadDuels();
          const duelId = response?.id;
          if (duelId) {
            this.router.navigate(['/practice', 'duels', 'duel', duelId]);
          }
        },
        error: () => {
          this.toastr.error(this.translateService.instant('ServerError'), this.translateService.instant('Error'));
        }
      });
  }

  confirmDuel(duel: Duel): void {
    if (this.confirmLoadingId) {
      return;
    }
    this.confirmLoadingId = duel.id;
    this.duelsService.confirmDuel(duel.id)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.confirmLoadingId = null)
      )
      .subscribe({
        next: () => {
          this.toastr.success(this.translateService.instant('Successfully'));
          this.loadDuels();
        },
        error: () => {
          this.toastr.error(this.translateService.instant('ServerError'), this.translateService.instant('Error'));
        }
      });
  }

  getStatusKey(status: number): string {
    switch (status) {
      case -1:
        return 'DuelStatusUpcoming';
      case 0:
        return 'DuelStatusRunning';
      default:
        return 'DuelStatusFinished';
    }
  }

  isConfirmAvailable(duel: Duel): boolean {
    return !!this.currentUser && !duel.isConfirmed && duel.playerSecond?.username === this.currentUser.username;
  }

  trackPlayer(index: number, player: DuelReadyPlayer): string {
    return player.username;
  }

  trackDuel(index: number, duel: Duel): number {
    return duel.id;
  }

  protected override getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Duels',
      breadcrumb: {
        links: [
          {name: 'Practice', isLink: false},
          {name: 'Duels', isLink: false},
        ],
      },
    };
  }

  private formatDateInput(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private defaultStartTime(): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    date.setSeconds(0, 0);
    return date;
  }

  private toBackendDate(value: string): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }
    const pad = (num: number) => num.toString().padStart(2, '0');
    const local = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);
    return `${local}${sign}${offsetHours}:${offsetMinutes}`;
  }
}
