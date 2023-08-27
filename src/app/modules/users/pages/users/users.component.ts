import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '../../../../colors.const';
import { UsersService } from '../../users.service';
import { CurrentUser } from 'app/shared/components/classes/current-user.component';
import { AuthenticationService } from 'app/auth/service';
import { NgxCountriesIsoService } from '@ngx-countries/core';
import { Subject, asyncScheduler } from 'rxjs';
import { sampleTime, takeUntil, throttleTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends CurrentUser {

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

  public filter = {
    country: '',
    ageFrom: null,
    username: '',
    firstName: '',
    ageTo: null,
  }
  public countries = [];
  public ordering = '-skills_rating';

  public users: Array<any> = [];
  public totalUsers: number = 0;
  public currentPage = 1;

  private _loader = new Subject();

  constructor(
    public service: UsersService,
    public translateService: TranslateService,
    public authService: AuthenticationService,
    public countriesService: NgxCountriesIsoService,
    public route: ActivatedRoute,
  ) {
    super(authService);
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
    }
    if(this.filter.country){
      params.country = this.filter.country;
    }
    if(this.filter.ageFrom){
      params.age_from = this.filter.ageFrom;
    }
    if(this.filter.ageTo){
      params.age_to = this.filter.ageTo;
    }
    if(this.filter.username){
      params.username = this.filter.username;
    }
    if(this.filter.firstName){
      params.first_name = this.filter.firstName;
    }
    this.service.getUsers(this.currentPage, params).subscribe(
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
