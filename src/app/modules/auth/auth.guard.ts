import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'app/auth/service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    public router: Router,
    public authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    if (this.authService.currentUserValue) {
      return of(true);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    }
  }
}

@Injectable({ providedIn: 'root' })
export class IsAuthenticatedGuard {
  constructor(
    public router: Router,
    public authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/home']);
      return of(false);
    } else {
      return of(true);
    }
  }
}
