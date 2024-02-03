import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '@auth/models';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { GeneralInfo } from '@problems/models/statistics.models';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule, FlexLayoutModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionHeaderComponent extends BaseLoadComponent<GeneralInfo> implements OnInit {
  constructor(public statisticsService: ProblemsStatisticsService) {
    super();
  }

  ngOnInit() {}

  getData() {
    return this.statisticsService.getGeneral(this.authService.currentUserValue.username);
  }

  afterChangeCurrentUser(currentUser: User) {
    if (currentUser) {
      this.loadData();
    }
  }
}
