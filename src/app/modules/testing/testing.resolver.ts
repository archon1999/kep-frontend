import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TestingApiService } from './testing-api.service';

@Injectable()
export class LastTestsResolver {
  constructor(private service: TestingApiService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getTests({ page_size: 6, ordering: '-id' });
  }
}

@Injectable()
export class TestResolver {
  constructor(private service: TestingApiService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getTest(route.paramMap.get('testId')).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}

@Injectable()
export class TestPassResolver {
  constructor(private service: TestingApiService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getTestPass(route.paramMap.get('testPassId')).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}


@Injectable()
export class ChaptersResolver {
  constructor(private service: TestingApiService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getChapters().pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}
