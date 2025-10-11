import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService } from '@app/modules/users';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { UserEducation } from '@users/domain';

@Component({
  selector: 'user-educations',
  standalone: true,
  imports: [
    TranslateModule,
    SpinnerComponent,
    KepCardComponent,
  ],
  templateUrl: './user-educations.component.html',
  styleUrl: './user-educations.component.scss'
})
export class UserEducationsComponent extends BaseLoadComponent<Array<UserEducation>> {
  public educations: Array<UserEducation> = [];
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
        if (username === this.currentUsername && this.educations.length) {
          return;
        }

        this.currentUsername = username;
        this.educations = [];
        this.isLoading = true;
        this.loadData();
      });
  }

  getData(): Observable<Array<UserEducation>> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return this.usersService.getUserEducations(username!);
  }

  override afterLoadData(educations: Array<UserEducation>): void {
    this.educations = educations ?? [];
  }

  protected trackEducation(_: number, education: UserEducation): string {
    return `${education.organization}-${education.degree}-${education.fromYear}-${education.toYear}`;
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
