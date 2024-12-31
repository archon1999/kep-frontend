import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DuelsService } from './duels.service';

@Injectable()
export class DuelResolver implements Resolve<boolean> {
  constructor(
    public service: DuelsService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getDuel(route.params['id']);
  }
}
