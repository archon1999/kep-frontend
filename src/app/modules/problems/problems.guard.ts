import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { AuthenticationService } from 'app/auth/service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProblemGuard implements CanActivate {
  constructor(
    public api: ApiService,
    public router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const problemId = route.params['id'];
    return this.api.get(`problems/${ problemId }/guard`).pipe(
      map((result: any) => result.success),
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
export class AttemptGuard implements CanActivate {
  constructor(
    public api: ApiService,
    public router: Router,
    public authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const attemptId = route.params['id'];
    return this.api.get(`attempts/${ attemptId }`).pipe(
      map((problem: any) => {
        return true;
      }),
      catchError((err) => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}
