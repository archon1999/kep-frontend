import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/auth/service';
import { CoreConfigService } from 'core/services/config.service';
import { ActivatedRoute } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { SectionProfileComponent } from '@problems/pages/profile/section-profile/section-profile.component';
import { SectionDifficultiesComponent } from '@problems/pages/profile/section-difficulties/section-difficulties.component';
import { SectionActivityComponent } from '@problems/pages/profile/section-activity/section-activity.component';
import { SectionHeatmapComponent } from '@problems/pages/profile/section-heatmap/section-heatmap.component';
import { SectionFactsComponent } from '@problems/pages/profile/section-facts/section-facts.component';
import { SectionTimeComponent } from '@problems/pages/profile/section-time/section-time.component';
import { SectionAttemptsForSolveComponent } from '@problems/pages/profile/section-attempts-for-solve/section-attempts-for-solve.component';
import { BaseComponent } from '@shared/components/classes/base.component';
import { User } from '@auth/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [],
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
export class ProfileComponent extends BaseComponent implements OnInit {
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

  afterChangeCurrentUser(currentUser: User) {
    this.username = currentUser.username;
  }
}
