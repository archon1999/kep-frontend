import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxCountriesService } from '@shared/third-part-modules/ngx-countries/ngx-countries.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { BaseTablePageComponent } from '@core/common/classes/base-table-page.component';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { PageResult } from '@core/common/classes/page-result';
import { User, UsersApiService } from "@app/modules/users";
import { initialState } from "@core/config/initial-state";
import { KepTableComponent } from "@shared/components/kep-table/kep-table.component";
import { KepStreakComponent } from "@shared/components/kep-streak/kep-streak.component";
import { KepPaginationComponent } from "@shared/components/kep-pagination/kep-pagination.component";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
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
    TableOrderingModule,
    KepcoinViewModule,
    NgbTooltipModule,
    ContestantViewModule,
    KepTableComponent,
    KepStreakComponent,
    KepPaginationComponent,
    KepCardComponent,
    ChallengesRankBadgeComponent,

  ]
})
export class UsersListPage extends BaseTablePageComponent<User> {
  override defaultPageSize = 10;
  override maxSize = 5;
  override defaultOrdering = '-skills_rating';

  public filterForm = new FormGroup({
    country: new FormControl(''),
    ageFrom: new FormControl(null),
    ageTo: new FormControl(null),
    username: new FormControl(''),
    firstName: new FormControl(''),
  });

  public countries = [];

  constructor(
    public service: UsersApiService,
    public countriesService: NgxCountriesService,
  ) {
    super();
  }

  get users() {
    return this.pageResult?.data;
  }

  ngOnInit(): void {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());

    this.service.getCountries().subscribe(
      (countries: Array<string>) => {
        for (const country of countries) {
          this.countries.push({
            id: country,
            name: this.countriesService.getName(country, this.translateService.currentLang),
          });
        }
      }
    );

    this.filterForm.valueChanges.pipe(debounceTime(1000)).subscribe(
      () => {
        this.reloadPage();
      }
    );
  }

  getPage(): Observable<PageResult<User>> | null {
    const params: any = {
      full: true,
      ordering: this.ordering,
      page: this.pageNumber,
      ...this.filterForm.value,
    };
    return this.service.getUsers(params);
  }

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
