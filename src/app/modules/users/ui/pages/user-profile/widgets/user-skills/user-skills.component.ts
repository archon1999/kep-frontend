import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BaseLoadComponent } from '@core/common';
import { UsersApiService } from '@app/modules/users';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { UserSkills } from '@users/domain';

@Component({
  selector: 'user-skills',
  standalone: true,
  imports: [
    TranslateModule,
    NgbProgressbarModule,
    SpinnerComponent,
    KepCardComponent,
  ],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.scss'
})
export class UserSkillsComponent extends BaseLoadComponent<UserSkills> {
  public userSkills: UserSkills | null = null;
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
        if (username === this.currentUsername && this.userSkills) {
          return;
        }

        this.currentUsername = username;
        this.userSkills = null;
        this.isLoading = true;
        this.loadData();
      });
  }

  getData(): Observable<UserSkills> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return this.usersService.getUserSkills(username!);
  }

  override afterLoadData(userSkills: UserSkills): void {
    this.userSkills = userSkills;
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
