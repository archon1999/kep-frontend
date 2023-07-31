import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "app/auth/service";
import { Observable, of } from "rxjs";
import { AuthGuard } from "app/auth/helpers";
@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
    constructor(
        public authService: AuthenticationService,
        public router: Router,
    ){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) : Observable<boolean> | boolean {
        if(this.authService.currentUserValue){
            this.router.navigate(['/home'], { skipLocationChange: true });
        }
        return of(true);
    }
}
