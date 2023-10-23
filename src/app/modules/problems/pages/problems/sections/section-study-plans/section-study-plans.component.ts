import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudyPlan } from '@problems/models/problems.models';
import { SwiperOptions } from 'swiper';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'section-study-plans',
  templateUrl: './section-study-plans.component.html',
  styleUrls: ['./section-study-plans.component.scss'],
})
export class SectionStudyPlansComponent implements OnInit {

  public studyPlans: Array<StudyPlan> = [];

  public swiperVisible = false;
  public swiperConfig: SwiperOptions = {
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 30
      },
    }
  };

  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ studyPlans }) => {
      this.studyPlans = studyPlans;
      setTimeout(() => this.swiperVisible = true, 200);
    });
  }

}
