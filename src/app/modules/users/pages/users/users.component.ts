import { Component } from '@angular/core';
import { UsersApiService } from '@users/users-api.service';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxCountriesService } from '@shared/third-part-modules/ngx-countries/ngx-countries.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { TableOrderingModule } from '@shared/components/table-ordering/table-ordering.module';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { User } from '@users/users.models';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { PageResult } from '@shared/components/classes/page-result';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { KepStreakComponent } from '@shared/components/kep-streak/kep-streak.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    NgSelectModule,
    SpinnerComponent,
    EmptyResultComponent,
    TableOrderingModule,
    ChallengesUserViewModule,
    KepcoinViewModule,
    NgbTooltipModule,
    KepPaginationComponent,
    ContestantViewModule,
    KepTableComponent,
    KepIconComponent,
    KepStreakComponent,
  ]
})
export class UsersComponent extends BaseTablePageComponent<User> {
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

  get users() {
    return this.pageResult?.data;
  }

  constructor(
    public service: UsersApiService,
    public countriesService: NgxCountriesService,
  ) {
    super();
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
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.coreConfig.app.appTitle,
            isLink: true,
            link: '/'
          },
        ]
      }
    };
  }
}
