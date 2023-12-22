import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudyPlan } from '@problems/models/problems.models';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CoreCommonModule } from '@core/common.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { StudyPlanCardModule } from '@problems/components/study-plan-card/study-plan-card.module';
import { fadeInLeftOnEnterAnimation } from 'angular-animations';
import { ProblemsApiService } from '@problems/services/problems-api.service';

@Component({
  selector: 'section-study-plans',
  templateUrl: './section-study-plans.component.html',
  styleUrls: ['./section-study-plans.component.scss'],
  standalone: true,
  animations: [fadeInLeftOnEnterAnimation()],
  imports: [
    CoreCommonModule,
    SwiperComponent,
    StudyPlanCardModule,
  ]
})
export class SectionStudyPlansComponent implements OnInit {

  public studyPlans: Array<StudyPlan> = [];

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
    public service: ProblemsApiService,
  ) { }

  ngOnInit(): void {
    this.service.getStudyPlans().subscribe(
      (studyPlans: Array<StudyPlan>) => {
        this.studyPlans = studyPlans;
      }
    );
  }

}
