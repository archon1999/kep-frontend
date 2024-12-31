import { CourseLessonPart } from '@app/modules/courses/interfaces/course-lesson-part';

export class CourseLesson {
  constructor(
    public title: string,
    public progress: number,
    public parts: Array<CourseLessonPart>,
    public description: string,
    public image: string,
    public lecturesCount?: number,
    public tasksCount?: number,
  ) {}

  static fromJSON(data: any) {
    return new CourseLesson(
      data.title,
      data.progress,
      data.parts?.map((data: any) => CourseLessonPart.fromJSON(data)),
      data.description,
      data.image,
      data?.lecturesCount,
      data?.tasksCount,
    );
  }
}
