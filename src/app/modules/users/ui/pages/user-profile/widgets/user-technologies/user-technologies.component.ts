import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService } from '@app/modules/users';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { UserTechnology } from '@users/domain';

@Component({
  selector: 'user-technologies',
  standalone: true,
  imports: [
    TranslateModule,
    SpinnerComponent,
    KepCardComponent,
  ],
  templateUrl: './user-technologies.component.html',
  styleUrl: './user-technologies.component.scss'
})
export class UserTechnologiesComponent extends BaseLoadComponent<UserTechnology[]> {
  public technologies: Array<UserTechnology> = [];
  override loadOnInit = false;

  private readonly usersService = inject(UsersApiService);
  private currentUsername: string | null = null;

  constructor() {
    super();
    this.isLoading = true;
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const parentParams$ = this.route.parent?.params ?? of({});

    combineLatest([this.route.params, parentParams$])
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(([params, parentParams]) => params?.['username'] ?? parentParams?.['username'] ?? this.getUsernameFromRoute()),
        filter((username): username is string => !!username),
        distinctUntilChanged(),
      )
      .subscribe(username => {
        if (username === this.currentUsername && this.technologies.length) {
          return;
        }

        this.currentUsername = username;
        this.technologies = [];
        this.isLoading = true;
        this.loadData();
      });
  }

  getData(): Observable<UserTechnology[]> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return this.usersService.getUserTechnologies(username!);
  }

  override afterLoadData(technologies: Array<UserTechnology>): void {
    this.technologies = technologies ?? [];
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
