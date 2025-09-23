import { ChangeDetectorRef, Component, Input, TemplateRef } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { CoreCommonModule } from '@core/common.module';
import { ProblemInfoCardComponent } from '../../../components/problem-info-card/problem-info-card.component';
import { ProblemSidebarStatisticsComponent } from './problem-sidebar-statistics/problem-sidebar-statistics.component';
import {
  ProblemSidebarTopAttemptsComponent
} from './problem-sidebar-top-attempts/problem-sidebar-top-attempts.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { finalize } from 'rxjs/operators';
import { ProblemStatistics } from './problem-statistics.model';

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
    NgbModalModule,
  ],
})
export class ProblemSidebarComponent {

  @Input() problem: Problem;

  public statistics: ProblemStatistics | null = null;
  public isStatisticsLoading = false;

  constructor(
    private readonly modalService: NgbModal,
    private readonly problemsService: ProblemsApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  openStatisticsModal(content: TemplateRef<unknown>) {
    this.isStatisticsLoading = true;
    this.statistics = null;

    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
    });

    this.problemsService.getProblemStatistics(this.problem.id)
      .subscribe({
        next: (result: ProblemStatistics) => {
          this.statistics = result;
          this.isStatisticsLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.statistics = null;
        }
      });
  }

}
