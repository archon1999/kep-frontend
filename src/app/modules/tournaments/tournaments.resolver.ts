import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TournamentsService } from './tournaments.service';


@Injectable()
export class TournamentResolver implements Resolve<boolean> {

  constructor(public service: TournamentsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.getTournament(route.paramMap.get('id'));
  }

}
