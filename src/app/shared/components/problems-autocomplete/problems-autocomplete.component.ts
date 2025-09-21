import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, Subject, map, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { ProblemsApiService } from "@problems/services/problems-api.service";

export interface Problem {
  id: number;
  title: string;
}

@Component({
  selector: 'problems-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './problems-autocomplete.component.html',
  styleUrls: ['./problems-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProblemsAutocompleteComponent),
      multi: true,
    },
  ]
})
export class ProblemsAutocompleteComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholder = '';
  @Input() pageSize = 20;
  @Input() ordering = 'id';
  @Input() queryParam = 'search';
  @Output() loaded = new EventEmitter<Problem[]>();

  control = new FormControl<number | null>(null);
  typeahead$ = new Subject<string>();
  items$ = new BehaviorSubject<Problem[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject<void>();
  private term = '';
  private page = 1;
  private pagesCount = 1;

  private onChange: (v: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private problemsApi: ProblemsApiService) {}

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => this.onChange(v ?? null));

    this.typeahead$
      .pipe(
        startWith(''),
        tap(t => {
          this.term = (t ?? '').trim();
          this.page = 1;
        }),
        switchMap(() => this.fetchPage(1)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: number | null): void {
    this.control.setValue(value, { emitEvent: false });
    if (value != null) {
      this.loading$.next(true);
      const params: any = { page: 1, pageSize: 1, ordering: this.ordering, id: value };
      this.problemsApi
        .getProblems(params)
        .pipe(
          map(r => r.data as Problem[]),
          tap(list => {
            const merged = this.mergeUnique(list, this.items$.value);
            this.items$.next(merged);
            this.loading$.next(false);
          })
        )
        .subscribe();
    }
  }

  registerOnChange(fn: (v: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.control.disable({ emitEvent: false });
    else this.control.enable({ emitEvent: false });
  }

  onBlur(): void {
    this.onTouched();
  }

  onScrollToEnd(): void {
    if (this.page < this.pagesCount && !this.loading$.value) {
      this.page += 1;
      this.fetchPage(this.page).subscribe();
    }
  }

  private fetchPage(page: number) {
    this.loading$.next(true);
    const params: any = { page, pageSize: this.pageSize, ordering: this.ordering };
    if (this.term) params[this.queryParam] = this.term;
    return this.problemsApi.getProblems(params).pipe(
      map(r => {
        this.pagesCount = r.pagesCount ?? Math.max(1, Math.ceil((r.total ?? r.count ?? 0) / this.pageSize));
        return r.data as Problem[];
      }),
      tap(list => {
        const next = page === 1 ? list : this.mergeUnique(this.items$.value, list);
        this.items$.next(next);
        this.loaded.emit(next);
        this.loading$.next(false);
      })
    );
  }

  private mergeUnique(a: Problem[], b: Problem[]): Problem[] {
    const m = new Map<number, Problem>();
    for (const x of a) m.set(x.id, x);
    for (const x of b) m.set(x.id, x);
    return Array.from(m.values());
  }
}
