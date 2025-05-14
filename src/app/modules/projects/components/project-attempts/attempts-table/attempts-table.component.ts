import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreCommonModule } from '@core/common.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { ProjectTechnologyComponent } from '@projects/components/project-technology/project-technology.component';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Project, ProjectAttempt, ProjectAttemptLogTask } from "@projects/domain/entities";
import { ProjectAttemptsRepository } from "@projects/data-access/repositories/project-attempts.repository";

@Component({
  selector: 'attempts-table',
  templateUrl: './attempts-table.component.html',
  styleUrls: ['./attempts-table.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    UserPopoverModule,
    NgbAccordionModule,
    ProjectTechnologyComponent
  ],
  animations: [fadeInOnEnterAnimation()]
})
export class AttemptsTableComponent implements OnInit {

  @Input() attempts: Array<ProjectAttempt>;
  @Input() project: Project;

  @ViewChild('modal') public modalRef: TemplateRef<any>;

  public logs: ProjectAttemptLogTask;
  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
    public modalService: NgbModal,
    public repository: ProjectAttemptsRepository,
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        this.currentUser = user;
      });
  }

  modalOpen(attemptId: number) {
    this.repository.getAttemptLog(attemptId).subscribe(
      (logs: any) => {
        this.logs = logs;
        this.modalService.open(this.modalRef, {
          centered: true,
          size: 'xl'
        });
      }
    );
  }

}
