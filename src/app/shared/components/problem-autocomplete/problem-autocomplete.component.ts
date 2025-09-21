import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, take } from 'rxjs/operators';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Problem } from '@problems/models/problems.models';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { PageResult } from '@core/common/classes/page-result';

interface ProblemOption {
  id: number;
  title: string;
  label: string;
}

@Component({
  selector: 'problem-autocomplete',
  standalone: true,
  templateUrl: './problem-autocomplete.component.html',
  styleUrls: ['./problem-autocomplete.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProblemAutocompleteComponent),
      multi: true,
    },
  ],
})
export class ProblemAutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() placeholder = 'Masala tanlang';
  @Input() notFoundText = 'Natija topilmadi';
  @Input() minSearchLength = 0;
  @Input() debounceTime = 300;
  @Input() pageSize = 10;
  @Input() appendTo: string | null = 'body';
  @Input() clearable = true;

  readonly control = new FormControl<number | null>(null);
  protected problemOptions: ProblemOption[] = [];
  protected loading = false;
  protected disabled = false;

  private selectedOption: ProblemOption | null = null;
  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly problemsApi: ProblemsApiService) {}

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value ?? null);
        if (value === null || value === undefined) {
          this.selectedOption = null;
        } else {
          const found = this.problemOptions.find((option) => option.id === value);
          if (found) {
            this.selectedOption = found;
          }
        }
      });

    this.search$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.length < this.minSearchLength) {
            return of<ProblemOption[]>([]);
          }
          this.loading = true;
          return this.fetchProblems(term).pipe(
            finalize(() => {
              this.loading = false;
            })
          );
        })
      )
      .subscribe((options) => {
        this.problemOptions = this.mergeSelectedOption(options);
      });

    this.triggerSearch('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: number | null): void {
    if (value === null || value === undefined) {
      this.control.setValue(null, { emitEvent: false });
      this.selectedOption = null;
      return;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      this.control.setValue(null, { emitEvent: false });
      this.selectedOption = null;
      return;
    }

    this.control.setValue(numericValue, { emitEvent: false });
    this.loadProblem(numericValue);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  protected handleSearch({ term }: { term: string }): void {
    this.triggerSearch(term ?? '');
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  protected onOpen(): void {
    if (!this.problemOptions.length) {
      this.triggerSearch('');
    }
  }

  private triggerSearch(term: string): void {
    this.search$.next(term);
  }

  private fetchProblems(term: string) {
    return this.problemsApi
      .getProblems({
        search: term,
        page: 1,
        pageSize: this.pageSize,
      })
      .pipe(
        map((response: PageResult<Problem>) =>
          response.data.map((problem) => this.mapProblemToOption(problem))
        ),
        catchError(() => of<ProblemOption[]>([]))
      );
  }

  private loadProblem(id: number): void {
    this.problemsApi
      .getProblem(id)
      .pipe(
        take(1),
        map((problem: Problem) => this.mapProblemToOption(problem)),
        catchError(() => of<ProblemOption | null>(null))
      )
      .subscribe((option) => {
        if (!option) {
          return;
        }
        this.selectedOption = option;
        this.problemOptions = this.mergeSelectedOption(this.problemOptions);
      });
  }

  private mergeSelectedOption(options: ProblemOption[]): ProblemOption[] {
    if (this.selectedOption) {
      const exists = options.some((option) => option.id === this.selectedOption!.id);
      if (!exists) {
        return [this.selectedOption, ...options];
      }
    }
    return options;
  }

  private mapProblemToOption(problem: Problem): ProblemOption {
    return {
      id: problem.id,
      title: problem.title,
      label: `${problem.id}. ${problem.title}`,
    };
  }
}
