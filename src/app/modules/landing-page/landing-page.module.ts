import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '../../../core/directives/directives';
import { FooterModule } from '../../layout/components/footer/footer.module';
import { CountUpModule } from 'ngx-countup';
import { IsAuthenticatedGuard } from '../../auth/helpers';
import { CorePipesModule } from '../../../core/pipes/pipes.module';
import { SlideMainComponent } from './slides/slide-main/slide-main.component';
import { SlideLearnComponent } from './slides/slide-learn/slide-learn.component';
import { SlidePracticeComponent } from './slides/slide-practice/slide-practice.component';
import { SlideStatisticsComponent } from './slides/slide-statistics/slide-statistics.component';
import { SlideCompetitionsComponent } from './slides/slide-competitions/slide-competitions.component';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'Landing',
    canActivate: [IsAuthenticatedGuard]
  },
];

@NgModule({
  declarations: [
    LandingPageComponent,
    SlideMainComponent,
    SlideLearnComponent,
    SlidePracticeComponent,
    SlideStatisticsComponent,
    SlideCompetitionsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    CoreDirectivesModule,
    FooterModule,
    CountUpModule,
    CorePipesModule,
    SwiperComponent,
    // NgxUsefulSwiperModule,
  ]
})
export class LandingPageModule {
}
