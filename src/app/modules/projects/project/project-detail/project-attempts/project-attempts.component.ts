import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@auth';
import { AuthService } from '@auth';
import { Project, ProjectAttempt } from '../../../../projects/projects.models';
import { ProjectsService } from '../../../../projects/projects.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'project-attempts',
  templateUrl: './project-attempts.component.html',
  styleUrls: ['./project-attempts.component.scss']
})
export class ProjectAttemptsComponent implements OnInit, OnDestroy {

  @Input() project: Project;

  public attempts: Array<ProjectAttempt> = [];

  public totalAttemptsCount = 0;
  public currentPage = 1;
  public myAttempts = true;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ProjectsService,
    public authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.authService.currentUser
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((user: any) => {
      this.currentUser = user;
    });

    this.reloadAttempts();
  }

  reloadAttempts(){
    if(this.myAttempts && this.currentUser){
      this.service.getProjectUserAttempts(this.project.id, this.currentUser.username, this.currentPage)
        .subscribe((result: any) => {
          this.attempts = result.data;
          this.totalAttemptsCount = result.total;
        })
    } else {
      this.service.getProjectAttempts(this.project.id, this.currentPage)
        .subscribe((result: any) => {
          this.attempts = result.data;
          this.totalAttemptsCount = result.total;
        })
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
