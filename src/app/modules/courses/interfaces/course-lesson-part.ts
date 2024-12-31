import { CourseLessonPartStatus } from '@app/modules/courses/constants/course-lesson-part-status';

export class CourseLessonPart {
  constructor(
    public id: number,
    public contentType: string,
    public status: number,
    public points: number,
    public content: any,
    public contentTypeIcon: string,
    public statusColor: string,
  ) {}

  static getStatusColor(status: number) {
    if (status === CourseLessonPartStatus.FAILED) {
      return 'danger';
    } else if (status === CourseLessonPartStatus.NOT_COMPLETED) {
      return 'dark';
    } else if (status === CourseLessonPartStatus.COMPLETED) {
      return 'success';
    }
  }

  static getContentTypeIcon(contentType: string) {
    if (contentType == 'lecture') {
      return 'learn';
    } else if (contentType === 'problem') {
      return 'custom_test';
    } else if (contentType === 'question') {
      return 'question';
    }
  }

  static fromJSON(data: any) {
    return new CourseLessonPart(
      data.id,
      data.contentType,
      data.status,
      data.points,
      data.content,
      this.getContentTypeIcon(data.contentType),
      this.getStatusColor(data.status),
    );
  }

  updateStatus(newStatus: number) {
    this.status = newStatus;
    this.statusColor = CourseLessonPart.getStatusColor(newStatus);
  }

  getClassOf(isCurrent: boolean) {
    if (isCurrent) {
      return `btn-outline-${ this.statusColor }`;
    } else {
      return `btn-relief-${ this.statusColor }`;
    }
  }
}
