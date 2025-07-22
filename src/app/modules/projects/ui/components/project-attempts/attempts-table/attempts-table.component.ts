import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreCommonModule } from '@core/common.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { ProjectTechnologyComponent } from '@projects/ui/components/project-technology/project-technology.component';
import { Project, ProjectAttempt, ProjectAttemptLogTask } from "@projects/domain/entities";
import { ProjectAttemptsRepository } from "@projects/data-access/repositories/project-attempts.repository";
import { EmptyResultComponent } from "@shared/components/empty-result/empty-result.component";
import { BaseComponent } from "@core/common";

@Component({
  selector: 'attempts-table',
  templateUrl: './attempts-table.component.html',
  styleUrls: ['./attempts-table.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    UserPopoverModule,
    NgbAccordionModule,
    ProjectTechnologyComponent,
    EmptyResultComponent
  ],
})
export class AttemptsTableComponent extends BaseComponent implements OnInit {

  @Input() attempts: Array<ProjectAttempt>;
  @Input() project: Project;

  @ViewChild('modal') public modalRef: TemplateRef<any>;

  public logs: ProjectAttemptLogTask;

  constructor(
    public authService: AuthService,
    public modalService: NgbModal,
    public repo: ProjectAttemptsRepository,
  ) {
    super();
  }

  modalOpen(attemptId: number) {
    this.repo.getAttemptLog(attemptId).subscribe(
      (logs: any) => {
        this.logs = logs;
        this.modalService.open(this.modalRef, {
          centered: true,
          size: 'xl'
        });
      }
    );
  }

  rerun(attemptId: number) {
    this.repo.rerun(attemptId).subscribe();
  }

}
