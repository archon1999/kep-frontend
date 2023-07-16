import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser) {
      return of(true);
    }

    return this.authenticationService.me.pipe(
      map((user: any) => {
        return true;
      }),
      catchError((err: any) => {
        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return of(false);
      })
    )
  }
}

@Injectable({ providedIn: 'root' })
export class IsAuthenticatedGuard implements CanActivate {
    constructor(
        public authService: AuthenticationService,
        public router: Router,
    ){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) : Observable<boolean> {
        if(this.authService.currentUserValue){
          this.router.navigate(['/home'])
          return of(false);
        } else {
          return this.authService.me.pipe(
            map((user: any) => {
              this.router.navigate(['/home'])
              return false;
            }),
            catchError((err: any) => {
              return of(true);
            })
          )
        }
    }
}
