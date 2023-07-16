import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { TestingService } from "./testing.service";

@Injectable()
export class LastTestsResolver implements Resolve<any> {
  constructor(private service: TestingService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getTests({ page_size: 6, ordering: '-id' });
  }
}

@Injectable()
export class TestResolver implements Resolve<any> {
  constructor(private service: TestingService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getTest(route.paramMap.get('testId')).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}

@Injectable()
export class TestPassResolver implements Resolve<any> {
  constructor(private service: TestingService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getTestPass(route.paramMap.get('testPassId')).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );;
  }
}


@Injectable()
export class ChaptersResolver implements Resolve<any> {
  constructor(private service: TestingService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getChapters().pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );;
  }
}
