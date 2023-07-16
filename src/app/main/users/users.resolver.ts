import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { UsersService } from "./users.service";

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUser(route.paramMap.get('username'));
  }

}

@Injectable()
export class UserInfoResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserInfo(route.paramMap.get('username'));
  }

}

@Injectable()
export class UserSkillsResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserSkills(route.paramMap.get('username'));
  }

}

@Injectable()
export class UserSocialResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserSocial(route.paramMap.get('username'));
  }

}


@Injectable()
export class UserTechnologiesResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserTechnologies(route.paramMap.get('username'));
  }

}

@Injectable()
export class UserEducationsResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserEducations(route.paramMap.get('username'));
  }

}

@Injectable()
export class UserWorkExperiencesResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserWorkExperiences(route.paramMap.get('username'));
  }
}

@Injectable()
export class UserBlogResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserBlog(route.paramMap.get('username'));
  }
}

@Injectable()
export class UserContestsRatingResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserContestsRating(route.paramMap.get('username'));
  }
}

@Injectable()
export class UserProblemsRatingResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserProblemsRating(route.paramMap.get('username'));
  }
}

@Injectable()
export class UserChallengesRatingResolver implements Resolve<any> {
  constructor(private service: UsersService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserChallengesRating(route.paramMap.get('username'));
  }
}
