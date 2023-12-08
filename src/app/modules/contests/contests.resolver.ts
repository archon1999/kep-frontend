import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContestsService } from './contests.service';

@Injectable({
  providedIn: 'root'
})
export class ContestResolver {
  constructor(public service: ContestsService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getContest(route.paramMap.get('id')).pipe(
      catchError((err) => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContestProblemsResolver {
  constructor(private service: ContestsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getContestProblems(route.paramMap.get('id'));
  }
}

@Injectable({
  providedIn: 'root'
})
export class OngoingContestsResolver {
  constructor(private service: ContestsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getAlreadyContests();
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpcomingContestsResolver {
  constructor(private service: ContestsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getUpcomingContests();
  }
}


@Injectable({
  providedIn: 'root'
})
export class ContestProblemResolver {
  constructor(private service: ContestsService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const contestId = route.paramMap.get('id');
    const symbol = route.paramMap.get('symbol');
    return this.service.getContestProblem(contestId, symbol).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}
