import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CoursesService } from './courses.service';


@Injectable({
  providedIn: 'root',
})
export class CourseGuard implements CanActivate {
  constructor(
    public service: CoursesService,
    public router: Router,
    public authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const courseId = route.params['id'];
    return this.service.getCourse(courseId).pipe(
      map((course: any) => {
        if (course.inThePipeline && !this.authService.currentUserValue.isSuperuser) {
          this.router.navigate(['/404'], { skipLocationChange: true });
          return false;
        }
        return true;
      }),
      catchError((err) => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}
