import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArenaService } from './arena.service';
import { Arena } from './arena.models';

@Injectable({
  providedIn: 'root',
})
export class ArenaResolver {
  constructor(private service: ArenaService, public router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<Arena> {
    return this.service.getArena(route.paramMap.get('id')).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}
