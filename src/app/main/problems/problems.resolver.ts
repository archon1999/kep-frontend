import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ApiService } from 'app/api.service';
import { Observable, of } from 'rxjs';
import { ProblemsService } from './problems.service';

@Injectable({
  providedIn: 'root'
})
export class ContestsResolver implements Resolve<boolean> {
  constructor(public api: ApiService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.api.get('problems/contests');
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProblemResolver implements Resolve<boolean> {
  constructor(public service: ProblemsService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getProblem(route.paramMap.get('id'));
  }
}

@Injectable({
  providedIn: 'root'
})
export class StudyPlanResolver implements Resolve<boolean> {
  constructor(public service: ProblemsService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getStudyPlan(route.paramMap.get('id'));
  }
}

@Injectable({
  providedIn: 'root'
})
export class StudyPlansResolver implements Resolve<boolean> {
  constructor(public service: ProblemsService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getStudyPlans();
  }
}
