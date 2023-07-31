import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    public api: ApiService,
  ) { }

  getCourses() {
    return this.api.get('courses');
  }

  getCourse(id: number | string){
    return this.api.get(`courses/${id}`);
  }

  getCourseDictionary(id: number | string){
    return this.api.get(`courses/${id}/dictionary`);
  }

  getCourseLessons(id: number | string){
    return this.api.get(`courses/${id}/lessons`);
  }
  
  getCourseParticipants(id: number | string){
    return this.api.get(`courses/${id}/participants`);
  }

  getCourseTopActiveParticipants(id: number | string){
    return this.api.get(`courses/${id}/top-active-participants`);
  }

  getCourseTopBestParticipants(id: number | string){
    return this.api.get(`courses/${id}/top-best-participants`);
  }

  getCourseReviews(id: number | string){
    return this.api.get(`courses/${id}/reviews`);
  }

  createReview(courseId: number, review: string, rating: number){
    var data = {review: review, rating: rating};
    return this.api.post(`courses/${courseId}/review-create/`, data);
  }

  updateReview(courseId: number, review: string, rating: number){
    var data = {review: review, rating: rating};
    return this.api.put(`courses/${courseId}/review-update/`, data);
  }

  getCourseLesson(id: number | string, lessonNumber: number | string){
    return this.api.get(`courses/${id}/lesson/?number=${lessonNumber}`);
  }

  checkLessonPartCompletion(lessonPartId: number, data={}){
    return this.api.post(`course-lesson-parts/${lessonPartId}/check-completion/`, data);
  }
  
  getCourseLessonPartComments(lessonPartId: number){
    return this.api.get(`course-lesson-parts/${lessonPartId}/comments/`);
  }
  
  emojiCourseLessonPartComment(lessonPartCommentId: number, emoji: number){
    var data = {'emoji': emoji};
    return this.api.post(`course-lesson-part-comments/${lessonPartCommentId}/emoji/`, data);
  }
  
  deleteCourseLessonPartComment(lessonPartCommentId: number){
    return this.api.delete(`course-lesson-part-comments/${lessonPartCommentId}/delete/`);
  }
  
  submitComment(lessonPartId: number, comment: string){
    var data = {comment: comment};
    return this.api.post(`course-lesson-parts/${lessonPartId}/comment-create/`, data);
  }
  
}
