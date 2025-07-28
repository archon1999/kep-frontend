import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { CellTemplateDirective, ColumnConfig, IxApiTableComponent, PageParams } from '@shared/components/table';
import { KepStreakComponent } from "@shared/components/kep-streak/kep-streak.component";
import {
  ChallengesRankBadgeComponent
} from "@challenges/components/challenges-user-view/challenges-rank-badge/challenges-rank-badge.component";

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
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UsersListPage extends BasePageComponent {
  @ViewChild(IxApiTableComponent) table!: IxApiTableComponent<User>;

  public columns: ColumnConfig<User>[] = [
    {
      field: (u: User) => u,
      header: 'User',
      key: 'user',
      icon: 'user',
      sortable: true,
      orderingKey: 'id',
      orderingReverse: true,
    },
    {
      field: 'skillsRating',
      header: 'Skills',
      icon: 'rating',
      sortable: true,
      orderingKey: 'skills_rating',
      orderingReverse: true,
      align: 'center'
    },
    {
      field: 'activityRating',
      header: 'Activity',
      icon: 'rating',
      sortable: true,
      orderingKey: 'activity_rating',
      orderingReverse: true,
      align: 'center'
    },
    {
      field: 'contestsRating',
      header: 'Contests',
      icon: 'contest',
      sortable: true,
      orderingKey: 'contests_rating__rating',
      orderingReverse: true,
      align: 'center'
    },
    {
      field: 'challengesRating',
      header: 'Challenges',
      icon: 'challenge',
      sortable: true,
      orderingKey: 'challenges_rating__rating',
      orderingReverse: true,
      align: 'center'
    },
    {
      field: (u: User) => u,
      key: 'streak',
      header: 'Streak',
      icon: 'streak',
      sortable: true,
      orderingKey: 'streak',
      orderingReverse: true,
      align: 'center'
    },
    {
      field: 'kepcoin',
      header: 'Kepcoin',
      icon: 'dollar',
      sortable: true,
      orderingKey: 'kepcoin',
      orderingReverse: true,
      align: 'center',
    },
    {
      field: 'lastSeen',
      header: 'LastSeen',
      icon: 'time',
      sortable: true,
      orderingKey: 'last_seen',
      orderingReverse: true,
      align: 'center',
    },
  ];

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
      this.table.load({page: 1});
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
