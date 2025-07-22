import { Component, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { Course, CourseParticipantReview } from '@courses/interfaces';
import { CoursesService } from '@courses/courses.service';
import { BaseLoadComponent } from '@core/common';
import { Observable } from 'rxjs';
import { CoreCommonModule } from '@core/common.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { ReviewCardComponent } from '@courses/pages/course/course-reviews/review-card/review-card.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillEditorComponent } from 'ngx-quill';
import { QuillModule } from '@shared/third-part-modules/quill/quill.module';

@Component({
  selector: 'course-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, SwiperComponent, ReviewCardComponent, NgbRatingModule, QuillEditorComponent, QuillModule]
})
export class ReviewsComponent extends BaseLoadComponent<CourseParticipantReview[]> implements OnInit {

  @Input() course: Course;

  public reviews: Array<CourseParticipantReview> = [];
  public review = '';
  public rating = 5.0;
  public hasReview = false;

  public reviewsSwiperConfig: SwiperOptions = {
    breakpoints: {
      1300: {
        slidesPerView: 3,
        spaceBetween: 100
      },
      880: {
        slidesPerView: 2,
        spaceBetween: 60
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 60
      }
    }
  };

  constructor(
    public service: CoursesService,
  ) {
    super();
  }

  getData(): Observable<CourseParticipantReview[]> {
    return this.service.getCourseReviews(this.course.id);
  }

  afterLoadData(reviews: CourseParticipantReview[]) {
    this.reviews = reviews;
    this.hasReview = false;
    for (const review of this.reviews) {
      if (review.username === this.currentUser.username) {
        this.review = review.review;
        this.rating = review.rating;
        this.hasReview = true;
        break;
      }
    }
  }

  submit() {
    if (this.review.length > 0) {
      if (this.hasReview) {
        this.service.updateReview(this.course.id, this.review, this.rating).subscribe(
          () => {
            this.loadData();
          }
        );
      } else {
        this.service.createReview(this.course.id, this.review, this.rating).subscribe(
          () => {
            this.loadData();
            this.hasReview = true;
          }
        );
      }
    }
  }

}
