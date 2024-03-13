import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountSettingsService } from './account-settings.service';
import { catchError, tap } from 'rxjs/operators';
import { getResourceById, Resources } from '@app/resources';

@Injectable()
export class GeneralInfoResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getUserGeneralInfo();
  }
}

@Injectable()
export class UserInfoResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserInfo();
  }

}

@Injectable()
export class UserSkillsResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserSkills();
  }

}

@Injectable()
export class UserSocialResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserSocial();
  }

}


@Injectable()
export class UserTechnologiesResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserTechnologies();
  }

}

@Injectable()
export class UserEducationsResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserEducations();
  }

}

@Injectable()
export class UserWorkExperiencesResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserWorkExperiences();
  }
}

@Injectable({
  providedIn: 'root'
})
export class TeamJoinResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService, public router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.joinTeam(route.params['id']).pipe(
      tap(() => {
        this.router.navigateByUrl(getResourceById(Resources.SettingsTab, 'teams'));
      }),
      catchError((err) => {
        this.router.navigateByUrl('404');
        return of(null);
      }),
    );
  }
}
