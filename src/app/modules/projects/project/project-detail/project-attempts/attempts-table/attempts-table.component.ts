import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { Project, ProjectAttempt, ProjectAttemptTaskLog } from '../../../../../projects/projects.models';
import { ProjectsService } from '../../../../../projects/projects.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'attempts-table',
  templateUrl: './attempts-table.component.html',
  styleUrls: ['./attempts-table.component.scss', '../../../../projects.scss']
})
export class AttemptsTableComponent implements OnInit {

  @Input() attempts: Array<ProjectAttempt>;
  @Input() project: Project;

  @ViewChild('modal') public modalRef: TemplateRef<any>;

  public logs: Array<ProjectAttemptTaskLog> = [];
  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
    public modalService: NgbModal,
    public service: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  modalOpen(attemptId: number){
    this.service.getAttemptLog(attemptId).subscribe(
      (logs: any) => {
        this.logs = logs;
        this.modalService.open(this.modalRef, {
          centered: true,
          size: 'xl'
        });    
      }
    )
  }
  
}
