import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService } from '@app/modules/users';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { UserWorkExperience } from '@users/domain';

@Component({
  selector: 'user-work-experiences',
  standalone: true,
  imports: [
    TranslateModule,
    SpinnerComponent,
    KepCardComponent,
  ],
  templateUrl: './user-work-experiences.component.html',
  styleUrl: './user-work-experiences.component.scss'
})
export class UserWorkExperiencesComponent extends BaseLoadComponent<Array<UserWorkExperience>> {
  public workExperiences: Array<UserWorkExperience> = [];
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
        if (username === this.currentUsername && this.workExperiences.length) {
          return;
        }

        this.currentUsername = username;
        this.workExperiences = [];
        this.isLoading = true;
        this.loadData();
      });
  }

  getData(): Observable<Array<UserWorkExperience>> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return this.usersService.getUserWorkExperiences(username!);
  }

  override afterLoadData(workExperiences: Array<UserWorkExperience>): void {
    this.workExperiences = workExperiences ?? [];
  }

  protected trackWork(_: number, workExperience: UserWorkExperience): string {
    return `${workExperience.company}-${workExperience.jobTitle}-${workExperience.fromYear}-${workExperience.toYear}`;
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
