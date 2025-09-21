import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject, BehaviorSubject, switchMap, startWith, map, tap, takeUntil, of } from 'rxjs';
import { UsersApiService } from "@app/modules/users";

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

@Component({
  selector: 'users-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './users-autocomplete.component.html',
  styleUrls: ['./users-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsersAutocompleteComponent),
      multi: true,
    },
  ],
})
export class UsersAutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = '';
  @Input() showAvatar = true;
  @Input() pageSize = 20;
  @Input() ordering = '-skills_rating';
  @Input() queryParam = 'search';
  @Output() loaded = new EventEmitter<User[]>();

  control = new FormControl<string | null>(null);
  typeahead$ = new Subject<string>();
  items$ = new BehaviorSubject<User[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject<void>();
  private term = '';
  private page = 1;
  private pagesCount = 1;

  private onChange: (v: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private usersApi: UsersApiService) {}

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

    this.control.registerOnDisabledChange?.((d) => d);
  }

  writeValue(value: string | null): void {
    this.control.setValue(value, { emitEvent: false });
    if (value) {
      this.loading$.next(true);
      this.usersApi
        .getUsers({ page: 1, pageSize: 1, ordering: this.ordering, [this.queryParam]: value })
        .pipe(
          map(r => r.data as User[]),
          tap(list => {
            const merged = this.mergeUnique(list, this.items$.value);
            this.items$.next(merged);
            this.loading$.next(false);
          })
        )
        .subscribe();
    }
  }

  registerOnChange(fn: (v: string | null) => void): void {
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
    return this.usersApi.getUsers(params).pipe(
      map(r => {
        this.pagesCount = r.pagesCount ?? Math.max(1, Math.ceil((r.total ?? r.count ?? 0) / this.pageSize));
        return r.data as User[];
      }),
      tap(list => {
        const next = page === 1 ? list : this.mergeUnique(this.items$.value, list);
        this.items$.next(next);
        this.loaded.emit(next);
        this.loading$.next(false);
      })
    );
  }

  private mergeUnique(a: User[], b: User[]): User[] {
    const mapU = new Map<string, User>();
    for (const x of a) mapU.set(x.username, x);
    for (const x of b) mapU.set(x.username, x);
    return Array.from(mapU.values());
  }
}
