import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '../../../../colors.const';
import { UsersService } from '../../users.service';
import { BaseComponent } from '../../../../shared/components/classes/base.component';
import { AuthenticationService } from 'app/auth/service';
import { NgxCountriesIsoService } from '@ngx-countries/core';
import { Subject, asyncScheduler } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { paramsMapper } from 'app/shared/utils';

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
          name: 'CPython.uz',
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
  })

  public countries = [];
  public ordering = '-skills_rating';

  public users: Array<any> = [];
  public totalUsers: number = 0;
  public currentPage = 1;

  private _loader = new Subject();

  constructor(
    public service: UsersService,
    public translateService: TranslateService,
    public countriesService: NgxCountriesIsoService,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        if('page' in params){
          this.currentPage = +params.page;
        }
      }
    )

    super.ngOnInit();

    this._loader.pipe(
      takeUntil(this._unsubscribeAll),
      throttleTime(500, asyncScheduler, { leading: false, trailing: true }),
    ).subscribe(
      () => {
        this._loadUsers();
      }
    )

    this.loadUsers();

    this.service.getCountries().subscribe(
      (countries: Array<string>) => {
        for(let country of countries){
          this.countries.push({
            id: country,
            name: this.countriesService.getName(country, this.translateService.currentLang),
          })
        }
      }
    )

    this.filterForm.valueChanges.subscribe(
      () => {
        this.loadUsers();
      }
    )
  }

  pageChange(page: number){
    this.loadUsers();
  }

  loadUsers(){
    setTimeout(() => {
      this._loader.next();
    }, 100);
  }

  _loadUsers(){
    let params: any = {
      full: true,
      ordering: this.ordering,
      ...this.filterForm.value
    }
    this.service.getUsers(this.currentPage, paramsMapper(params)).subscribe(
      (result: any) => {
        this.users = result.data;
        this.totalUsers = result.total;
      }
    )
  }

  changeOrdering(ordering: string){
    this.ordering = ordering;
    this.loadUsers();
  }

}
