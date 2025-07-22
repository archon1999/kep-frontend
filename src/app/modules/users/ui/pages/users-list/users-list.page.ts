import { Component, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxCountriesService } from '@shared/third-part-modules/ngx-countries/ngx-countries.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { User, UsersApiService } from "@app/modules/users";
import { initialState } from "@core/config/initial-state";
import { IxApiTableComponent, ColumnConfig, CellTemplateDirective, PageParams } from '@shared/components/table';
import { KepStreakComponent } from "@shared/components/kep-streak/kep-streak.component";
import { ChallengesRankBadgeComponent } from "@challenges/components/challenges-user-view/challenges-rank-badge/challenges-rank-badge.component";

@Component({
  selector: 'page-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    NgSelectModule,
    KepcoinViewModule,
    NgbTooltipModule,
    ContestantViewModule,
    IxApiTableComponent,
    CellTemplateDirective,
    KepStreakComponent,
    ChallengesRankBadgeComponent,

  ]
})
export class UsersListPage extends BasePageComponent {
  @ViewChild(IxApiTableComponent) table!: IxApiTableComponent<User>;

  columns: ColumnConfig<User>[] = [
    { field: (u: User) => u, header: 'User', key: 'user', icon: 'user', sortable: true, orderingKey: 'id' },
    { field: (u: User) => u, header: 'FullName', key: 'fullName', icon: 'username', sortable: true, orderingKey: 'first_name' },
    { field: (u: User) => u.skillsRating, header: 'Rating', key: 'skillsRating', icon: 'rating', sortable: true, orderingKey: 'skills_rating' },
    { field: (u: User) => u.activityRating, header: 'ActivityRating', key: 'activityRating', icon: 'rating', sortable: true, orderingKey: 'activity_rating' },
    { field: (u: User) => u.contestsRating, header: 'Contests', key: 'contestsRating', icon: 'contest', sortable: true, orderingKey: 'contests_rating__rating' },
    { field: (u: User) => u.challengesRating, header: 'Challenges', key: 'challengesRating', icon: 'challenge', sortable: true, orderingKey: 'challenges_rating__rating' },
    { field: (u: User) => u, header: 'Streak', key: 'streak', icon: 'streak', sortable: true, orderingKey: 'streak' },
    { field: 'kepcoin', header: 'Kepcoin', icon: 'dollar', sortable: true, orderingKey: 'kepcoin' },
    { field: 'lastSeen', header: 'LastSeen', icon: 'time', sortable: true, orderingKey: 'last_seen' },
  ];

  pageOptions = [10, 20, 50];

  public filterForm = new FormGroup({
    country: new FormControl(''),
    ageFrom: new FormControl(null),
    ageTo: new FormControl(null),
    username: new FormControl(''),
    firstName: new FormControl(''),
  });

  public countries: Array<{ id: string; name: string }> = [];

  constructor(
    public service: UsersApiService,
    public countriesService: NgxCountriesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadContentHeader();

    this.service.getCountries().subscribe(countries => {
      for (const country of countries) {
        this.countries.push({
          id: country,
          name: this.countriesService.getName(country, this.translateService.currentLang),
        });
      }
    });

    this.filterForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.table.load({ page: 1 });
    });
  }

  fetchPage = (params: PageParams) =>
    this.service.getUsers({
      full: true,
      ...params,
      ...this.filterForm.value,
    });

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'MENU.USERS',
      breadcrumb: {
        type: '',
        links: [
          {
            name: initialState.appTitle,
            isLink: false,
          },
        ]
      }
    };
  }
}
