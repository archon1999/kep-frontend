import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { ApiService } from "app/api.service";
import { AuthenticationService } from "app/auth/service";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ContestStatus } from "../../contests.models";

@Injectable()
export class ContestCreateGuard implements CanActivate{
    constructor(
        public api: ApiService,
        public router: Router,
    ){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) : Observable<boolean> | boolean {
        return this.api.get('user-contests/create-guard').pipe(
            map((result: any) => {
                return result.success;
            }),
            catchError((err) => {
                this.router.navigate(['/404'], { skipLocationChange: true });
                return of(false);
            })
        )
    }
}

@Injectable()
export class ContestGuard implements CanActivate{
    constructor(
        public api: ApiService,
        public router: Router,
        public authService: AuthenticationService,
    ){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) : Observable<boolean> | boolean {
        let contestId = route.params['contestId'];
        return this.api.get(`user-contests/${contestId}/guard`).pipe(
            map((contest: any) => {
                if(this.authService.currentUserValue?.isSuperuser){
                    return true;
                }
                if(contest.status == ContestStatus.NOT_STARTED){
                    this.router.navigate(['/competitions', 'contests', 'user-contests', 'contest', contestId]);
                    return false;
                }
                return true;
            }),
            catchError((err) => {
                this.router.navigate(['/404'], { skipLocationChange: true });
                return of(false);
            })
        )
    }
}
