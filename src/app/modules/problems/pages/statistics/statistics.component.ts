import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { SectionProfileComponent } from '@problems/pages/statistics/section-profile/section-profile.component';
import {
  SectionDifficultiesComponent
} from '@problems/pages/statistics/section-difficulties/section-difficulties.component';
import { SectionActivityComponent } from '@problems/pages/statistics/section-activity/section-activity.component';
import { SectionHeatmapComponent } from '@problems/pages/statistics/section-heatmap/section-heatmap.component';
import { SectionFactsComponent } from '@problems/pages/statistics/section-facts/section-facts.component';
import { SectionTimeComponent } from '@problems/pages/statistics/section-time/section-time.component';
import {
  SectionAttemptsForSolveComponent
} from '@problems/pages/statistics/section-attempts-for-solve/section-attempts-for-solve.component';
import { BaseComponent } from '@core/common/classes/base.component';
import { AuthUser } from '@auth';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    SectionProfileComponent,
    SectionDifficultiesComponent,
    SectionActivityComponent,
    SectionHeatmapComponent,
    SectionFactsComponent,
    SectionTimeComponent,
    SectionAttemptsForSolveComponent
  ]
})
export class StatisticsComponent extends BaseComponent implements OnInit {
  public username: string;

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params['username']) {
          this.username = params['username'];
        }
      }
    );
  }

  afterChangeCurrentUser(currentUser: AuthUser) {
    this.username = currentUser.username;
  }
}
