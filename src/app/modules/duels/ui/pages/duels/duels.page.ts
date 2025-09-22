import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { DuelsApiService } from '@duels/data-access';
import { Duel, DuelPreset, DuelReadyPlayer } from '@duels/domain';
import { PageResult } from '@core/common/classes/page-result';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DuelReadyStatusCardComponent
} from '@duels/ui/components/duel-ready-status-card/duel-ready-status-card.component';
import {
  DuelReadyPlayersSectionComponent
} from '@duels/ui/components/duel-ready-players-section/duel-ready-players-section.component';
import { DuelsListSectionComponent } from '@duels/ui/components/duels-list-section/duels-list-section.component';
import { DuelPresetModalComponent } from '@duels/ui/components/duel-preset-modal/duel-preset-modal.component';

@Component({
  selector: 'page-duels',
  standalone: true,
  templateUrl: './duels.page.html',
  styleUrls: ['./duels.page.scss'],
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    NgbModalModule,
    TranslateModule,
    DuelReadyStatusCardComponent,
    DuelReadyPlayersSectionComponent,
    DuelsListSectionComponent,
  ]
})
export class DuelsPage extends BasePageComponent implements OnInit {
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
  allDuelsPage = 1;
  allDuelsPageSize = 10;
  allDuelsResult: PageResult<Duel> | null = null;
  allDuelsLoading = false;
  duelPresets: DuelPreset[] = [];
  duelPresetsLoading = false;
  selectedOpponent: DuelReadyPlayer | null = null;
  confirmLoadingId: number | null = null;
  protected readonly duelsApi = inject(DuelsApiService);
  private fb = inject(FormBuilder);
  duelForm = this.fb.group({
    presetId: [null as number | null, Validators.required],
    startTime: ['', Validators.required],
  });
  private modalRef: NgbModalRef | null = null;

  get readyPlayersTotal(): number {
    return this.readyPlayersResult?.total || 0;
  }

  get duelsTotal(): number {
    return this.duelsResult?.total || 0;
  }

  get allDuelsTotal(): number {
    return this.allDuelsResult?.total || 0;
  }

  get minStartTime(): string {
    return this.formatDateInput(new Date());
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadReadyStatus();
    this.loadReadyPlayers();
    this.loadAllDuels();
  }

  override afterChangeCurrentUser(): void {
    if (this.currentUser) {
      this.loadDuels();
    } else {
      this.duelsResult = null;
    }
    this.loadAllDuels();
  }

  onReadyStatusChange(ready: boolean): void {
    if (this.readyStatusLoading) {
      return;
    }

    const previous = this.isReady;
    this.isReady = ready;
    this.readyStatusLoading = true;
    this.duelsApi.updateReadyStatus(ready)
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
    this.duelsApi.getReadyStatus()
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
    this.duelsApi.getReadyPlayers({
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
    this.duelsApi.getDuels({
      page: this.duelsPage,
      page_size: this.duelsPageSize,
      username: this.currentUser.username,
    })
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.duelsLoading = false),
      )
      .subscribe({
        next: result => {
          this.duelsResult = result;
          this.cdr.markForCheck();
        },
        error: () => {
          this.duelsResult = null;
          this.cdr.markForCheck();
        },
      });
  }

  loadAllDuels(page?: number): void {
    if (page) {
      this.allDuelsPage = page;
    }

    this.allDuelsLoading = true;
    this.duelsApi.getDuels({
      page: this.allDuelsPage,
      page_size: this.allDuelsPageSize,
    })
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.allDuelsLoading = false),
      )
      .subscribe({
        next: result => {
          this.allDuelsResult = result;
          this.cdr.markForCheck();
        },
        error: () => {
          this.allDuelsResult = null;
          this.cdr.markForCheck();
        },
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
    this.modalRef = this.modalService.open(DuelPresetModalComponent, {
      size: 'lg',
      centered: true,
    });

    const component = this.modalRef.componentInstance as DuelPresetModalComponent;
    component.form = this.duelForm;
    component.opponent = opponent;
    component.presets = this.duelPresets;
    component.loading = this.duelPresetsLoading;
    component.minDate = this.minStartTime;
    this.cdr.detectChanges();

    const createSubscription = component.create.subscribe(() => this.createDuel());

    this.modalRef.result.finally(() => {
      createSubscription.unsubscribe();
      this.modalRef = null;
      this.selectedOpponent = null;
    });
    this.duelsApi.getDuelPresets(opponent.username)
      .pipe(
        takeUntil(this._unsubscribeAll),
      )
      .subscribe({
        next: presets => {
          this.duelPresets = presets;
          this.duelPresetsLoading = false;
          if (this.modalRef?.componentInstance) {
            const modalComponent = this.modalRef.componentInstance as DuelPresetModalComponent;
            modalComponent.presets = this.duelPresets;
            modalComponent.loading = this.duelPresetsLoading;
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.duelPresets = [];
          this.duelPresetsLoading = false;
          if (this.modalRef?.componentInstance) {
            const modalComponent = this.modalRef.componentInstance as DuelPresetModalComponent;
            modalComponent.presets = this.duelPresets;
            modalComponent.loading = this.duelPresetsLoading;
          }
          this.cdr.detectChanges();
        },
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
    this.duelsApi.createDuel({
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
          this.loadAllDuels();
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
    this.duelsApi.confirmDuel(duel.id)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.confirmLoadingId = null)
      )
      .subscribe({
        next: () => {
          this.toastr.success(this.translateService.instant('Successfully'));
          this.loadDuels();
          this.loadAllDuels();
        },
        error: () => {
          this.toastr.error(this.translateService.instant('ServerError'), this.translateService.instant('Error'));
        }
      });
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
