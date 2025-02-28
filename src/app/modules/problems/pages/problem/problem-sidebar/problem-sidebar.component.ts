import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { SidebarType } from 'app/modules/problems/constants/sidebar-type';
import { CoreCommonModule } from '@core/common.module';
import { ProblemInfoCardComponent } from '../../../components/problem-info-card/problem-info-card.component';
import { ProblemSidebarStatisticsComponent } from './problem-sidebar-statistics/problem-sidebar-statistics.component';
import {
  ProblemSidebarTopAttemptsComponent
} from './problem-sidebar-top-attempts/problem-sidebar-top-attempts.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'problem-sidebar',
  templateUrl: './problem-sidebar.component.html',
  styleUrls: ['./problem-sidebar.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ProblemInfoCardComponent,
    ProblemSidebarStatisticsComponent,
    ProblemSidebarTopAttemptsComponent,
    KepCardComponent,
  ],
})
export class ProblemSidebarComponent {

  @Input() problem: Problem;

  public SidebarType = SidebarType;
  public sidebarType = SidebarType.INFO;

}
