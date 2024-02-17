import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService, User } from '@auth';
import { ProjectsService } from '@projects/projects.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '@app/modules/projects/interfaces/project';
import { ProjectAttempt } from '@app/modules/projects/interfaces/project-attempt';
import { AttemptsTableComponent } from '@projects/pages/project/project-attempts/attempts-table/attempts-table.component';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'project-attempts',
  templateUrl: './project-attempts.component.html',
  styleUrls: ['./project-attempts.component.scss'],
  standalone: true,
  imports: [
    AttemptsTableComponent,
    CoreCommonModule
  ]
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

  reloadAttempts() {
    if (this.myAttempts && this.currentUser) {
      this.service.getProjectUserAttempts(this.project.id, this.currentUser.username, this.currentPage)
        .subscribe((result: any) => {
          this.attempts = result.data;
          this.totalAttemptsCount = result.total;
        });
    } else {
      this.service.getProjectAttempts(this.project.id, this.currentPage)
        .subscribe((result: any) => {
          this.attempts = result.data;
          this.totalAttemptsCount = result.total;
        });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
