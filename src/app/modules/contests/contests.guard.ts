import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '@core/data-access/api.service';
import { AuthService } from '@auth';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getResourceById, Resources } from '@app/resources';
import { ContestStatus } from '@contests/constants/contest-status';

@Injectable({
  providedIn: 'root'
})
export class ContestGuard {
  constructor(
    public api: ApiService,
    public router: Router,
    public authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const contestId = route.params['id'];
    return this.api.get(`contests/${contestId}/guard`).pipe(
      map((contest: any) => {
        if (this.authService.currentUserValue?.isSuperuser) {
          return true;
        }
        if (contest.status === ContestStatus.NOT_STARTED) {
          this.router.navigateByUrl(getResourceById(Resources.Contest, contestId));
          return false;
        }
        return true;
      }),
      catchError((err) => {
        this.router.navigate(['/404'], {skipLocationChange: true});
        return of(false);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContestCreateGuard {
  constructor(
    public api: ApiService,
    public router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    return this.api.get('contests/create-guard').pipe(
      map((result: any) => {
        return result.success;
      }),
      catchError((err) => {
        this.router.navigate(['/404'], {skipLocationChange: true});
        return of(false);
      })
    );
  }
}
