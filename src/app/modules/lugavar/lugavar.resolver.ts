import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LugavarService } from './lugavar.service';

@Injectable()
export class DailyTrickResolver implements Resolve<boolean> {
  constructor(public service: LugavarService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getDailyTrick();
  }
}

@Injectable()
export class DailyQuestionResolver implements Resolve<boolean> {
  constructor(public service: LugavarService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getDailyQuestion();
  }
}

@Injectable()
export class DailyInterestingFactResolver implements Resolve<boolean> {
  constructor(public service: LugavarService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getDailyInterestingFact();
  }
}
