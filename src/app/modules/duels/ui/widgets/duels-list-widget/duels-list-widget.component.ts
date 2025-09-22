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
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageResult } from '@core/common/classes/page-result';
import { DuelsApiService } from '@duels/data-access';
import { Duel } from '@duels/domain';
import { DuelsListSectionComponent } from '@duels/ui/components/duels-list-section/duels-list-section.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'duels-list-widget',
  standalone: true,
  imports: [DuelsListSectionComponent],
  template: `
    <duels-list-section
      [titleKey]="titleKey"
      [duels]="duelsResult?.data ?? []"
      [total]="duelsResult?.total ?? 0"
      [page]="page"
      [pageSize]="pageSize"
      [loading]="loading"
      [confirmLoadingId]="confirmLoadingId"
      [currentUsername]="currentUsername"
      (pageChange)="loadDuels($event)"
      (confirm)="confirmDuel($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuelsListWidgetComponent implements OnInit, OnChanges, OnDestroy {
  @Input() titleKey = 'MyDuels';
  @Input() username: string | null = null;
  @Input() currentUsername: string | null = null;
  @Input() pageSize = 10;
  @Input() set refreshKey(value: number) {
    if (this._refreshKey === value) {
      return;
    }
    this._refreshKey = value;
    if (this.initialized) {
      this.loadDuels();
    }
  }

  @Output() readonly duelConfirmed = new EventEmitter<void>();

  page = 1;
  duelsResult: PageResult<Duel> | null = null;
  loading = false;
  confirmLoadingId: number | null = null;

  private readonly duelsApi = inject(DuelsApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly translateService = inject(TranslateService);
  private readonly toastr = inject(ToastrService);
  private readonly destroy$ = new Subject<void>();
  private initialized = false;
  private _refreshKey = 0;

  ngOnInit(): void {
    this.initialized = true;
    this.loadDuels();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && !changes['username'].firstChange) {
      this.page = 1;
      this.loadDuels();
    }
    if (changes['pageSize'] && !changes['pageSize'].firstChange) {
      this.page = 1;
      this.loadDuels();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDuels(page?: number): void {
    if (page) {
      this.page = page;
    }

    this.loading = true;
    const params: Record<string, unknown> = {
      page: this.page,
      page_size: this.pageSize,
    };

    if (this.username) {
      params['username'] = this.username;
    }

    this.duelsApi.getDuels(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
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

  confirmDuel(duel: Duel): void {
    if (this.confirmLoadingId) {
      return;
    }

    this.confirmLoadingId = duel.id;
    this.duelsApi.confirmDuel(duel.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.confirmLoadingId = null;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.toastr.success(this.translateService.instant('Successfully'));
          this.loadDuels();
          this.duelConfirmed.emit();
        },
        error: () => {
          this.toastr.error(this.translateService.instant('ServerError'), this.translateService.instant('Error'));
        },
      });
  }
}
