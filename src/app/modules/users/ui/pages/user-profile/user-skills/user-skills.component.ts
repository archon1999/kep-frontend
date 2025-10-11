import { Component, inject } from '@angular/core';

import { UserSkills, UserTechnology } from '@users/domain';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { BaseLoadComponent } from "@core/common";
import { Observable, forkJoin } from "rxjs";
import { UsersApiService } from "@app/modules/users";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'user-skills',
  standalone: true,
  imports: [
    NgbProgressbarModule,
    TranslateModule,
    KepCardComponent
  ],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.scss'
})
export class UserSkillsComponent extends BaseLoadComponent<{userSkills: UserSkills; userTechnologies: Array<UserTechnology>;}> {
  public userSkills: UserSkills | null = null;
  public userTechnologies: Array<UserTechnology> = [];
  override loadOnInit = false;

  private readonly usersService = inject(UsersApiService);
  private currentUsername: string | null = null;

  constructor() {
    super();
    this.isLoading = true;
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        const username = params?.['username'] ?? this.getUsernameFromRoute();

        if (!username || username === this.currentUsername) {
          return;
        }

        this.currentUsername = username;
        this.userSkills = null;
        this.userTechnologies = [];
        this.loadData();
      });
  }

  getData(): Observable<{userSkills: UserSkills; userTechnologies: Array<UserTechnology>;}> {
    const username = this.currentUsername ?? this.getUsernameFromRoute();

    return forkJoin({
      userSkills: this.usersService.getUserSkills(username!),
      userTechnologies: this.usersService.getUserTechnologies(username!),
    });
  }

  override afterLoadData({userSkills, userTechnologies}: {userSkills: UserSkills; userTechnologies: Array<UserTechnology>;}) {
    this.userSkills = userSkills;
    this.userTechnologies = userTechnologies ?? [];
  }

  private getUsernameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('username') ?? this.route.parent?.snapshot.paramMap.get('username') ?? null;
  }
}
