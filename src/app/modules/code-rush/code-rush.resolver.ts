import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot, Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CodeRushApiService } from './services/code-rush-api.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CodeRushResolver implements Resolve<boolean> {
  constructor(
    public service: CodeRushApiService,
    public router: Router,
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getCodeRush(route.params['id']).pipe(
      catchError((err) => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}
