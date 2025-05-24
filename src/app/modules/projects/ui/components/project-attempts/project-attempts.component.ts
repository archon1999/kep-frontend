import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseTablePageComponent } from '@app/common';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { User } from '@auth';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { Project, ProjectAttempt } from "@projects/domain/entities";
import { ProjectAttemptsRepository } from "@projects/data-access/repositories/project-attempts.repository";
import { AttemptsTableComponent } from "@projects/ui/components/project-attempts/attempts-table/attempts-table.component";

@Component({
  selector: 'project-attempts',
  templateUrl: './project-attempts.component.html',
  styleUrls: ['./project-attempts.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepPaginationComponent,
    AttemptsTableComponent
  ]
})
export class ProjectAttemptsComponent extends BaseTablePageComponent<ProjectAttempt> {
  override maxSize = 5;

  @Input() project: Project;
  public myAttempts = true;

  constructor(public repository: ProjectAttemptsRepository) {
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
      return this.repository.listByUsername(this.currentUser.username, {
        page: this.pageNumber,
        project_id: this.project.id
      });
    } else {
      return this.repository.list({
        page: this.pageNumber,
        project_id: this.project.id
      });
    }
  }

  myAttemptsClick() {
    this.pageNumber = 1;
    this.reloadPage();
  }
}
