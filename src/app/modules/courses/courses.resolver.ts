import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoursesService } from './courses.service';
import { Course } from '@courses/interfaces';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '@auth';

@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<Course> {
  constructor(private service: CoursesService, private router: Router, public authService: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const courseId = route.paramMap.get('id');
    return this.service.getCourse(courseId).pipe(
      tap((course: Course) => {
        if (course.inThePipeline && !this.authService.currentUserValue.isSuperuser) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
      }),
      catchError((e) => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(null);
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class CourseLessonsResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const courseId = route.paramMap.get('id');
    return this.service.getCourseLessons(courseId);
  }
}

@Injectable({
  providedIn: 'root',
})
export class CourseDictionaryResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const courseId = route.paramMap.get('id');
    return this.service.getCourseDictionary(courseId);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CourseLessonResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const courseId = route.paramMap.get('id');
    const lessonNumber = route.paramMap.get('lessonNumber');
    return this.service.getCourseLesson(courseId, lessonNumber);
  }
}
