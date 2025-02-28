import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChallengesApiService } from '@challenges/services';

@Injectable({
  providedIn: 'root'
})
export class ChallengeResolver {
  constructor(private service: ChallengesApiService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getChallenge(route.paramMap.get('id')).pipe(
      catchError(err => {
        this.router.navigate(['/404'], {skipLocationChange: true});
        return of(true);
      })
    );
  }
}
