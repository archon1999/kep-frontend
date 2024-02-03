import { Component, Input, OnInit } from '@angular/core';
import { AuthService, User } from '@auth';
import { CourseParticipantReview } from '../../courses.models';
import { CoursesService } from '../../courses.service';
import { SwiperOptions } from 'swiper/types/swiper-options';

@Component({
  selector: 'course-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {

  @Input() courseId: number;

  public reviews: Array<CourseParticipantReview> = [];
  public review = '';
  public rating = 5.0;
  public hasReview = false;

  public currentUser: User = this.authService.currentUserValue;

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
    public authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.reloadReviews();
  }

  reloadReviews() {
    this.service.getCourseReviews(this.courseId).subscribe((result: any) => {
      this.reviews = result;
      this.hasReview = false;
      for (const review of this.reviews) {
        if (review.username === this.currentUser.username) {
          this.review = review.review;
          this.rating = review.rating;
          this.hasReview = true;
          break;
        }
      }
    });
  }

  submit() {
    if (this.review.length > 0) {
      if (this.hasReview) {
        this.service.updateReview(this.courseId, this.review, this.rating).subscribe((result: any) => {
          this.reloadReviews();
        });
      } else {
        this.service.createReview(this.courseId, this.review, this.rating).subscribe((result: any) => {
          this.reloadReviews();
          this.hasReview = true;
        });
      }
    }
  }

}
