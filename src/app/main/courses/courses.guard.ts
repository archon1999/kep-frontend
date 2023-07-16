import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "app/auth/service";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { CoursesService } from "./courses.service";

@Injectable()
export class CourseGuard implements CanActivate {
    constructor(
        public service: CoursesService,
        public router: Router,
        public authService: AuthenticationService,
    ){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) : Observable<boolean> | boolean {
        let courseId = route.params['courseId'];
        return this.service.getCourse(courseId).pipe(
            map((course: any) => {
                if(course.inThePipeline && !this.authService.currentUserValue.isSuperuser){
                    this.router.navigate(['/404'], { skipLocationChange: true });
                    return false;
                }
                return true;
            }),
            catchError((err) => {
                this.router.navigate(['/404'], { skipLocationChange: true });
                return of(true);
            })
        )
    }
}
