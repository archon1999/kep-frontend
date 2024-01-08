import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth/service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingPageGuard {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/home'], { skipLocationChange: true });
    }
    return of(true);
  }
}
