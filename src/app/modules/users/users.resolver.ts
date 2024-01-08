import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersApiService } from './users-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUser(route.paramMap.get('username'));
  }

}

@Injectable({
  providedIn: 'root',
})
export class UserInfoResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserInfo(route.paramMap.get('username'));
  }

}

@Injectable({
  providedIn: 'root',
})
export class UserSkillsResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserSkills(route.paramMap.get('username'));
  }

}

@Injectable({
  providedIn: 'root',
})
export class UserSocialResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserSocial(route.paramMap.get('username'));
  }

}


@Injectable({
  providedIn: 'root',
})
export class UserTechnologiesResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserTechnologies(route.paramMap.get('username'));
  }

}

@Injectable({
  providedIn: 'root',
})
export class UserEducationsResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserEducations(route.paramMap.get('username'));
  }

}

@Injectable({
  providedIn: 'root',
})
export class UserWorkExperiencesResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserWorkExperiences(route.paramMap.get('username'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserBlogResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserBlog(route.paramMap.get('username'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserContestsRatingResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserContestsRating(route.paramMap.get('username'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserProblemsRatingResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserProblemsRating(route.paramMap.get('username'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserChallengesRatingResolver {
  constructor(private service: UsersApiService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUserChallengesRating(route.paramMap.get('username'));
  }
}
