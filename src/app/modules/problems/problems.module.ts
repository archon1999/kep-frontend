import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule, NgbNavModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from 'app/auth/helpers';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxCaptureModule } from 'ngx-capture';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ContestantViewModule } from '@shared/components/contestant-view/contestant-view.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { ProblemCardModule } from '@shared/components/problem-card/problem-card.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { KepcoinSpendSwalModule } from '../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { NouisliderModule } from '@shared/third-part-modules/nouislider/nouislider.module';
import { TourModule } from '@shared/third-part-modules/tour/tour.module';
import { ProblemBodyModule } from './components/problem-body/problem-body.module';
import { AttemptComponent } from './pages/attempt/attempt.component';
import { AttemptsComponent } from './pages/attempts/attempts.component';
import { ProblemAttemptsComponent } from './pages/problem/problem-attempts/problem-attempts.component';
import { ProblemDescriptionComponent } from './pages/problem/problem-description/problem-description.component';
import { ProblemDiscussionComponent } from './pages/problem/problem-discussion/problem-discussion.component';
import { ProblemOgImageComponent } from './pages/problem/problem-og-image/problem-og-image.component';
import { ProblemSidebarComponent } from './pages/problem/problem-sidebar/problem-sidebar.component';
import { ProblemComponent } from './pages/problem/problem.component';
import { ProblemsComponent } from './pages/problems/problems.component';
import { SectionContestsComponent } from './pages/problems/sections/section-contests/section-contests.component';
import { SectionInfoComponent } from './pages/problems/sections/section-info/section-info.component';
import { SectionProblemsFilterComponent } from './pages/problems/sections/section-problems-filter/section-problems-filter.component';
import { SectionProblemsTableComponent } from './pages/problems/sections/section-problems-table/section-problems-table.component';
import { SectionSidebarComponent } from './pages/problems/sections/section-sidebar/section-sidebar.component';
import { SectionStudyPlansComponent } from './pages/problems/sections/section-study-plans/section-study-plans.component';
import { SectionTopicsComponent } from './pages/problems/sections/section-topics/section-topics.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SectionActivityComponent } from './pages/profile/section-activity/section-activity.component';
import { SectionAttemptsForSolveComponent } from './pages/profile/section-attempts-for-solve/section-attempts-for-solve.component';
import { SectionDifficultiesComponent } from './pages/profile/section-difficulties/section-difficulties.component';
import { SectionFactsComponent } from './pages/profile/section-facts/section-facts.component';
import { SectionHeatmapComponent } from './pages/profile/section-heatmap/section-heatmap.component';
import { SectionTimeComponent } from './pages/profile/section-time/section-time.component';
import { RatingHistoryComponent } from './pages/rating/rating-history/rating-history.component';
import { RatingComponent } from './pages/rating/rating.component';
import { StudyPlanComponent } from './pages/study-plan/study-plan.component';
import { AttemptGuard, ProblemGuard } from './problems.guard';
import { ContestsResolver, ProblemResolver, StudyPlanResolver, StudyPlansResolver } from './problems.resolver';
import { SectionProfileComponent } from './pages/profile/section-profile/section-profile.component';
import { AttemptsTableModule } from './components/attempts-table/attempts-table.module';
import { StudyPlanCardModule } from './components/study-plan-card/study-plan-card.module';
import { PaginationModule } from 'app/shared/components/pagination/pagination.module';
import {
  ProblemSidebarStatisticsComponent
} from './pages/problem/problem-sidebar/problem-sidebar-statistics/problem-sidebar-statistics.component';
import {
  ProblemSidebarTopAttemptsComponent
} from './pages/problem/problem-sidebar/problem-sidebar-top-attempts/problem-sidebar-top-attempts.component';
import { TableOrderingModule } from 'app/shared/components/table-ordering/table-ordering.module';
import { HackAttemptsComponent } from './pages/hack-attempts/hack-attempts.component';
import { HackAttemptsTableModule } from './components/hack-attempts-table/hack-attempts-table.module';
import { ProblemsPipesModule } from './pipes/problems-pipes.module';
import { ProblemHacksComponent } from './pages/problem/problem-hacks/problem-hacks.component';
import { MonacoEditorModule as MonacoModule } from '../../shared/third-part-modules/monaco-editor/monaco-editor.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { CoreSidebarModule } from 'core/components';
import { NgScrollbar } from 'ngx-scrollbar';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { CoreCommonModule } from 'core/common.module';
import { ProblemInfoCardComponent } from '@problems/components/problem-info-card/problem-info-card.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

const routes: Routes = [
  {
    path: '',
    component: ProblemsComponent,
    title: 'Problems.Problems',
    resolve: {
      contests: ContestsResolver,
      studyPlans: StudyPlansResolver,
    }
  },
  {
    path: 'study-plan/:id',
    component: StudyPlanComponent,
    data: {
      title: 'Problems.StudyPlan',
    },
    resolve: {
      studyPlan: StudyPlanResolver,
    }
  },
  {
    path: 'problem/:id',
    component: ProblemComponent,
    data: {
      title: 'Problems.Problem',
    },
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'problem/:id/attempts',
    component: ProblemComponent,
    data: {
      title: 'Problems.Problem',
    },
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'problem/:id/hacks',
    component: ProblemComponent,
    data: {
      title: 'Problems.Problem',
    },
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'problem/:id/og-image',
    component: ProblemOgImageComponent,
    resolve: {
      problem: ProblemResolver,
    },
    canActivate: [ProblemGuard],
  },
  {
    path: 'attempts',
    component: AttemptsComponent,
    data: { animation: 'attempts' },
    title: 'Problems.Attempts',
  },
  {
    path: 'attempts/:id',
    component: AttemptComponent,
    data: { animation: 'attempt', title: 'Problems.Attempt' },
    canActivate: [AttemptGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Problems.Profile',
    data: { animation: 'profile' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rating',
    component: RatingComponent,
    title: 'Problems.Rating',
    data: { animation: 'problems-rating' }
  },
  {
    path: 'rating/history',
    component: RatingHistoryComponent,
    title: 'Problems.RatingHistory',
    data: { animation: 'problems-rating-history' }
  },
  {
    path: 'hacks',
    component: HackAttemptsComponent,
    data: { animation: 'hack-attempts' },
    title: 'Problems.HackAttempts',
  },
];

@NgModule({
  declarations: [
    ProblemsComponent,
    ProblemSidebarComponent,
    AttemptsComponent,
    ProblemComponent,
    RatingComponent,
    ProfileComponent,
    RatingHistoryComponent,
    ProblemDescriptionComponent,
    ProblemAttemptsComponent,
    ProblemDiscussionComponent,
    ProblemSidebarComponent,
    AttemptComponent,
    ProblemOgImageComponent,
    SectionContestsComponent,
    SectionProblemsTableComponent,
    SectionProblemsFilterComponent,
    SectionSidebarComponent,
    SectionProblemsFilterComponent,
    SectionDifficultiesComponent,
    SectionActivityComponent,
    SectionHeatmapComponent,
    SectionFactsComponent,
    SectionAttemptsForSolveComponent,
    SectionTimeComponent,
    StudyPlanComponent,
    SectionStudyPlansComponent,
    SectionInfoComponent,
    SectionProfileComponent,
    ProblemSidebarStatisticsComponent,
    ProblemSidebarTopAttemptsComponent,
    HackAttemptsComponent,
    ProblemHacksComponent,
  ],
  imports: [
    CoreCommonModule,
    RouterModule.forChild(routes),
    MathjaxModule,
    AttemptsTableModule,
    StudyPlanCardModule,
    ContentHeaderModule,
    TranslateModule,
    NgbRatingModule,
    NgbNavModule,
    NgbTooltipModule,
    ProblemBodyModule,
    NgSelectModule,
    NgbModule,
    ClipboardModule,
    CodeEditorModule,
    MonacoEditorModule,
    UserPopoverModule,
    NouisliderModule,
    NgApexchartsModule,
    ProblemCardModule,
    ContestantViewModule,
    ContestCardModule,
    SectionTopicsComponent,
    KepcoinViewModule,
    KepcoinSpendSwalModule,
    NgxCaptureModule,
    ProblemCardModule,
    TourModule,
    PaginationModule,
    TableOrderingModule,
    HackAttemptsTableModule,
    ProblemsPipesModule,
    MonacoEditorModule,
    MonacoModule,
    ApexChartModule,
    CoreSidebarModule,
    NgScrollbar,
    SwiperComponent,
    ProblemInfoCardComponent,
    EmptyResultComponent,
    SpinnerComponent,
  ],
  exports: [
    SectionProfileComponent
  ],
  providers: [
    ProblemGuard,
    AttemptGuard,
  ]
})
export class ProblemsModule {
}
