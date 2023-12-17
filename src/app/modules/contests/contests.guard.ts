import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from 'app/auth/service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContestStatus } from './contests.models';

@Injectable()
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
    return this.api.get(`contests/${ contestId }/guard`).pipe(
      map((contest: any) => {
        if (this.authService.currentUserValue?.isSuperuser) {
          return true;
        }
        if (contest.status === ContestStatus.NOT_STARTED) {
          this.router.navigate(['/competitions', 'contests', 'contest', contestId]);
          return false;
        }
        return true;
      }),
      catchError((err) => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(false);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContestCreateGuard implements CanActivate {
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
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(false);
      })
    );
  }
}
