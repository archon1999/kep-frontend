import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountSettingsService } from './account-settings.service';

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

@Injectable()
export class UserTeamsResolver implements Resolve<any> {
  constructor(private service: AccountSettingsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserTeams();
  }
}
