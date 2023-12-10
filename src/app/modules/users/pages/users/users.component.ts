import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '@users/users.service';
import { BaseComponent } from '@shared/components/classes/base.component';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { paramsMapper } from 'app/shared/utils';
import { NgxCountriesService } from '@shared/third-part-modules/ngx-countries/ngx-countries.service';
import { SpinnersEnum } from '@shared/components/spinner/spinners.enum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent {

  public contentHeader = {
    headerTitle: 'MENU.USERS',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: this.coreConfig.app.appTitle,
          isLink: false,
          link: '/'
        },
      ]
    }
  };

  public filterForm = new FormGroup({
    country: new FormControl(''),
    ageFrom: new FormControl(null),
    ageTo: new FormControl(null),
    username: new FormControl(''),
    firstName: new FormControl(''),
  });

  public countries = [];
  public ordering = '-skills_rating';

  public users: Array<any> = [];
  public totalUsers = 0;
  public currentPage = 1;

  public SpinnersEnum = SpinnersEnum;
  public spinnerShow = true;

  private _loader = new Subject();

  constructor(
    public service: UsersService,
    public translateService: TranslateService,
    public countriesService: NgxCountriesService,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.spinner.getSpinner(SpinnersEnum.UsersTable).subscribe(
      (spinner) => {
        this.spinnerShow = spinner.show;
      }
    );

    this.route.queryParams.subscribe(
      (params: any) => {
        if ('page' in params) {
          this.currentPage = +params.page;
        }
      }
    );

    this._loader.pipe(
      takeUntil(this._unsubscribeAll),
      throttleTime(500, asyncScheduler, { leading: false, trailing: true }),
    ).subscribe(
      () => {
        this._loadUsers();
      }
    );

    this.loadUsers();

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

    this.filterForm.valueChanges.subscribe(
      () => {
        this.loadUsers();
      }
    );
  }

  pageChange(_: number) {
    this.loadUsers();
  }

  loadUsers() {
    setTimeout(() => {
      this._loader.next(null);
    }, 100);
  }

  _loadUsers() {
    this.spinner.show(SpinnersEnum.UsersTable);
    const params: any = {
      full: true,
      ordering: this.ordering,
      ...this.filterForm.value
    };
    this.service.getUsers(this.currentPage, paramsMapper(params)).subscribe(
      (result: any) => {
        this.users = result.data;
        this.totalUsers = result.total;
        this.spinner.hide(SpinnersEnum.UsersTable);
      }
    );
  }

  changeOrdering(ordering: string) {
    this.ordering = ordering;
    this.loadUsers();
  }

}
