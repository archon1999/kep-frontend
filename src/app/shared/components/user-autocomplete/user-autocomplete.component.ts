import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { UsersApiService } from '@users/data-access/api/users-api.service';
import { User } from '@users/domain/entities/user.entity';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { PageResult } from '@shared/components/table';

interface UserOption {
  username: string;
  avatar?: string;
  label: string;
}

@Component({
  selector: 'user-autocomplete',
  standalone: true,
  templateUrl: './user-autocomplete.component.html',
  styleUrls: ['./user-autocomplete.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserAutocompleteComponent),
      multi: true,
    },
  ],
})
export class UserAutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() placeholder = 'Foydalanuvchi tanlang';
  @Input() notFoundText = 'Natija topilmadi';
  @Input() minSearchLength = 0;
  @Input() debounceTime = 300;
  @Input() pageSize = 10;
  @Input() appendTo: string | null = 'body';
  @Input() clearable = true;
  @Input() showAvatar = true;

  readonly control = new FormControl<string | null>(null);
  protected userOptions: UserOption[] = [];
  protected loading = false;
  protected disabled = false;

  private selectedOption: UserOption | null = null;
  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly usersApi: UsersApiService) {}

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value ?? null);
        if (!value) {
          this.selectedOption = null;
          return;
        }
        const found = this.userOptions.find((option) => option.username === value);
        if (found) {
          this.selectedOption = found;
        }
      });

    this.search$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.length < this.minSearchLength) {
            return of<UserOption[]>([]);
          }
          this.loading = true;
          return this.fetchUsers(term).pipe(
            finalize(() => {
              this.loading = false;
            })
          );
        })
      )
      .subscribe((options) => {
        this.userOptions = this.mergeSelectedOption(options);
      });

    this.triggerSearch('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: string | null): void {
    if (!value) {
      this.control.setValue(null, { emitEvent: false });
      this.selectedOption = null;
      return;
    }

    this.control.setValue(value, { emitEvent: false });
    this.loadUser(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
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
    if (!this.userOptions.length) {
      this.triggerSearch('');
    }
  }

  private triggerSearch(term: string): void {
    this.search$.next(term);
  }

  private fetchUsers(term: string) {
    return this.usersApi
      .getUsers({
        search: term,
        page: 1,
        pageSize: this.pageSize,
      })
      .pipe(
        map((response: PageResult<User>) =>
          response.data.map((user) => this.mapUserToOption(user))
        ),
        catchError(() => of<UserOption[]>([]))
      );
  }

  private loadUser(username: string): void {
    this.usersApi
      .getUser(username)
      .pipe(
        take(1),
        map((user: User) => this.mapUserToOption(user)),
        catchError(() => of<UserOption | null>(null))
      )
      .subscribe((option) => {
        if (!option) {
          return;
        }
        this.selectedOption = option;
        this.userOptions = this.mergeSelectedOption(this.userOptions);
      });
  }

  private mergeSelectedOption(options: UserOption[]): UserOption[] {
    if (this.selectedOption) {
      const exists = options.some(
        (option) => option.username === this.selectedOption!.username
      );
      if (!exists) {
        return [this.selectedOption, ...options];
      }
    }
    return options;
  }

  private mapUserToOption(user: User): UserOption {
    return {
      username: user.username,
      avatar: user.avatar,
      label: user.username,
    };
  }
}
