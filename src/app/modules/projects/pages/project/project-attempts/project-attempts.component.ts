import { Component, Input } from '@angular/core';
import { ProjectsService } from '@projects/projects.service';
import { Project } from '@app/modules/projects/interfaces/project';
import { ProjectAttempt } from '@app/modules/projects/interfaces/project-attempt';
import {
  AttemptsTableComponent
} from '@projects/pages/project/project-attempts/attempts-table/attempts-table.component';
import { CoreCommonModule } from '@core/common.module';
import { BaseTablePageComponent } from '@app/common';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { User } from '@auth';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';

@Component({
  selector: 'project-attempts',
  templateUrl: './project-attempts.component.html',
  styleUrls: ['./project-attempts.component.scss'],
  standalone: true,
  imports: [
    AttemptsTableComponent,
    CoreCommonModule,
    KepPaginationComponent
  ]
})
export class ProjectAttemptsComponent extends BaseTablePageComponent<ProjectAttempt> {
  override maxSize = 5;

  @Input() project: Project;
  public myAttempts = true;

  constructor(public service: ProjectsService) {
    super();
  }

  get attempts() {
    return this.pageResult?.data;
  }

  afterChangeCurrentUser(currentUser: User) {
    this.myAttempts = this.isAuthenticated;
  }

  getPage(): Observable<PageResult<ProjectAttempt>> {
    if (this.myAttempts && this.currentUser) {
      return this.service.getProjectUserAttempts(this.project.id, this.currentUser.username, this.pageNumber);
    } else {
      return this.service.getProjectAttempts(this.project.id, this.pageNumber);
    }
  }

  myAttemptsClick() {
    this.pageNumber = 1;
    this.reloadPage();
  }
}
