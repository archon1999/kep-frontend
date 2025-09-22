import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DuelsApiService } from '@duels/data-access';
import { DuelReadyStatusCardComponent } from '@duels/ui/components/duel-ready-status-card/duel-ready-status-card.component';

@Component({
  selector: 'duel-ready-status-widget',
  standalone: true,
  imports: [DuelReadyStatusCardComponent],
  template: `
    <duel-ready-status-card
      [isReady]="isReady"
      [disabled]="loading"
      (readyChange)="onReadyStatusChange($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelReadyStatusWidgetComponent implements OnInit, OnDestroy {
  @Output() readonly statusChanged = new EventEmitter<boolean>();

  isReady = false;
  loading = false;

  private readonly duelsApi = inject(DuelsApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadReadyStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onReadyStatusChange(ready: boolean): void {
    if (this.loading) {
      return;
    }

    const previous = this.isReady;
    this.isReady = ready;
    this.loading = true;
    this.duelsApi.updateReadyStatus(ready)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: status => {
          this.isReady = status?.ready ?? ready;
          this.statusChanged.emit(this.isReady);
          this.cdr.markForCheck();
        },
        error: () => {
          this.isReady = previous;
          this.cdr.markForCheck();
        },
      });
  }

  private loadReadyStatus(): void {
    this.loading = true;
    this.duelsApi.getReadyStatus()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: status => {
          this.isReady = status?.ready ?? false;
          this.statusChanged.emit(this.isReady);
          this.cdr.markForCheck();
        },
        error: () => {
          this.isReady = false;
          this.cdr.markForCheck();
        },
      });
  }
}
