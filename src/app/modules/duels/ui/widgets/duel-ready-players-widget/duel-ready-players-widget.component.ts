import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { DuelsApiService } from '@duels/data-access';
import { DuelPreset, DuelReadyPlayer } from '@duels/domain';
import { DuelReadyPlayersSectionComponent } from '@duels/ui/components/duel-ready-players-section/duel-ready-players-section.component';
import { DuelPresetModalComponent } from '@duels/ui/components/duel-preset-modal/duel-preset-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'duel-ready-players-widget',
  standalone: true,
  imports: [DuelReadyPlayersSectionComponent, NgbModalModule],
  template: `
    <duel-ready-players-section
      [players]="readyPlayersResult?.data ?? []"
      [total]="readyPlayersResult?.total ?? 0"
      [page]="readyPlayersPage"
      [pageSize]="readyPlayersPageSize"
      [loading]="readyPlayersLoading"
      [currentUsername]="currentUsername"
      (pageChange)="loadReadyPlayers($event)"
      (challenge)="openDuelModal($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelReadyPlayersWidgetComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentUsername: string | null = null;
  @Input() set refreshKey(value: number) {
    if (this._refreshKey === value) {
      return;
    }
    this._refreshKey = value;
    if (this.initialized) {
      this.loadReadyPlayers();
    }
  }

  @Output() readonly duelCreated = new EventEmitter<void>();

  readyPlayersPage = 1;
  readyPlayersPageSize = 12;
  readyPlayersResult: PageResult<DuelReadyPlayer> | null = null;
  readyPlayersLoading = false;

  duelPresets: DuelPreset[] = [];
  duelPresetsLoading = false;
  selectedOpponent: DuelReadyPlayer | null = null;

  private readonly duelsApi = inject(DuelsApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  duelForm = this.fb.group({
    presetId: [null as number | null, Validators.required],
    startTime: ['', Validators.required],
  });
  private modalRef: NgbModalRef | null = null;
  private initialized = false;
  private _refreshKey = 0;

  ngOnInit(): void {
    this.initialized = true;
    this.loadReadyPlayers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUsername'] && !changes['currentUsername'].firstChange) {
      this.readyPlayersPage = 1;
      this.loadReadyPlayers();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.closeModal();
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
        takeUntil(this.destroy$),
        finalize(() => {
          this.readyPlayersLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: result => {
          this.readyPlayersResult = result;
          this.cdr.markForCheck();
        },
        error: () => {
          this.readyPlayersResult = null;
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: presets => {
          this.duelPresets = presets;
          this.duelPresetsLoading = false;
          this.updateModalPresets();
        },
        error: () => {
          this.duelPresets = [];
          this.duelPresetsLoading = false;
          this.updateModalPresets();
        },
      });
  }

  closeModal(): void {
    this.modalRef?.close();
    this.modalRef = null;
    this.selectedOpponent = null;
  }

  get minStartTime(): string {
    return this.formatDateInput(new Date());
  }

  private createDuel(): void {
    if (!this.selectedOpponent) {
      return;
    }

    if (this.duelForm.invalid) {
      this.duelForm.markAllAsTouched();
      return;
    }

    const { presetId, startTime } = this.duelForm.value;
    this.duelsApi.createDuel({
      duel_username: this.selectedOpponent.username,
      duel_preset: presetId!,
      start_time: this.toBackendDate(startTime as string),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.toastr.success(this.translateService.instant('DuelCreated'), this.translateService.instant('Successfully'));
          this.closeModal();
          this.loadReadyPlayers();
          this.duelCreated.emit();
          const duelId = response?.id;
          if (duelId) {
            this.router.navigate(['/practice', 'duels', 'duel', duelId]);
          }
        },
        error: () => {
          this.toastr.error(this.translateService.instant('ServerError'), this.translateService.instant('Error'));
        },
      });
  }

  private updateModalPresets(): void {
    if (!this.modalRef?.componentInstance) {
      return;
    }

    const modalComponent = this.modalRef.componentInstance as DuelPresetModalComponent;
    modalComponent.presets = this.duelPresets;
    modalComponent.loading = this.duelPresetsLoading;
    this.cdr.detectChanges();
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
