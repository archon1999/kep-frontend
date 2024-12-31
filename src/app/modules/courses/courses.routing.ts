import { Route } from '@angular/router';
import { CourseGuard } from '@app/modules/courses/courses.guard';
import { CourseDictionaryResolver, CourseLessonResolver, CourseLessonsResolver, CourseResolver } from '@courses/courses.resolver';
import { AuthGuard } from '@auth';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/courses/courses.component').then(c => c.CoursesComponent),
    data: { animation: 'courses' },
    title: 'Courses.Courses',
  },
  {
    path: 'course/:id',
    loadComponent: () => import('./pages/course/course.component').then(c => c.CourseComponent),
    canActivate: [CourseGuard],
    data: {
      title: 'Courses.Course',
    },
    resolve: {
      course: CourseResolver,
    }
  },
  {
    path: 'course/:id/lesson/:lessonNumber',
    loadComponent: () => import('./pages/course-lesson/lesson.component').then(c => c.LessonComponent),
    data: { animation: 'lesson', title: 'Courses.CourseLesson' },
    resolve: {
      courseLessons: CourseLessonsResolver,
      courseLesson: CourseLessonResolver,
      course: CourseResolver
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'course/:id/dictionary',
    loadComponent: () => import('./pages/dictionary/dictionary.component').then(c => c.DictionaryComponent),
    data: { animation: 'course-dictionary' },
    resolve: {
      courseLessons: CourseLessonsResolver,
      course: CourseResolver,
      courseDictionary: CourseDictionaryResolver,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'course/:id/dictionary/training',
    loadComponent: () => import('./pages/dictionary/training/training.component').then(c => c.TrainingComponent),
    data: { animation: 'course-dictionary-training' },
    resolve: {
      courseLessons: CourseLessonsResolver,
      course: CourseResolver,
      courseDictionary: CourseDictionaryResolver,
    },
    canActivate: [AuthGuard],
  }
]  satisfies Route[];
