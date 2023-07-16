import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@core/directives/directives';
import { FooterModule } from 'app/layout/components/footer/footer.module';
import { CountUpModule } from 'ngx-countup';
import { IsAuthenticatedGuard } from 'app/auth/helpers';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { SlideMainComponent } from './slides/slide-main/slide-main.component';
import { SlideLearnComponent } from './slides/slide-learn/slide-learn.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { SlidePracticeComponent } from './slides/slide-practice/slide-practice.component';
import { SlideStatisticsComponent } from './slides/slide-statistics/slide-statistics.component';
import { SlideCompetitionsComponent } from './slides/slide-competitions/slide-competitions.component';


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
    NgxUsefulSwiperModule,
  ]
})
export class LandingPageModule { }
