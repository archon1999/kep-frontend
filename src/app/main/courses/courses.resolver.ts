import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Course } from './courses.models';
import { CoursesService } from "./courses.service";

@Injectable()
export class CoursesResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getCourses();
  }
}

@Injectable()
export class CourseResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    let courseId = route.paramMap.get('courseId');
    return this.service.getCourse(courseId);
  }
}

@Injectable()
export class CourseLessonsResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    let courseId = route.paramMap.get('courseId');
    return this.service.getCourseLessons(courseId);
  }
}

@Injectable()
export class CourseDictionaryResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    let courseId = route.paramMap.get('courseId');
    return this.service.getCourseDictionary(courseId);
  }
}

@Injectable()
export class CourseLessonResolver implements Resolve<Course> {
  constructor(private service: CoursesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    let courseId = route.paramMap.get('courseId');
    let lessonNumber = route.paramMap.get('lessonNumber');
    return this.service.getCourseLesson(courseId, lessonNumber);
  }
}
