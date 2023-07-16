import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Contest } from "./user-contests.models";
import { ContestsService } from "./user-contests.service";

@Injectable()
export class ContestResolver implements Resolve<Contest> {
  constructor(public service: ContestsService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getContest(route.paramMap.get('contestId')).pipe(
      catchError((err) => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}

@Injectable()
export class ContestProblemsResolver implements Resolve<Contest> {
  constructor(private service: ContestsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getContestProblems(route.paramMap.get('contestId'));
  }
}

@Injectable()
export class ContestProblemResolver implements Resolve<Contest> {
  constructor(private service: ContestsService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    let contestId = route.paramMap.get('contestId');
    let symbol = route.paramMap.get('symbol');
    return this.service.getContestProblem(contestId, symbol).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );;
  }
}
