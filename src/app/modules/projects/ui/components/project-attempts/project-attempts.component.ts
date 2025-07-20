import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseTablePageComponent } from '@app/common';
import { interval, Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { AuthUser } from '@auth';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { Project, ProjectAttempt } from "@projects/domain/entities";
import { ProjectAttemptsRepository } from "@projects/data-access/repositories/project-attempts.repository";
import {
  AttemptsTableComponent
} from "@projects/ui/components/project-attempts/attempts-table/attempts-table.component";
import { takeUntil } from "rxjs/operators";

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
  @Input() hackathonId?: number;
  public myAttempts = true;

  constructor(public repository: ProjectAttemptsRepository) {
    super();

    interval(5000).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => this.reloadPage());
  }

  get attempts() {
    return this.pageResult?.data;
  }

  afterChangeCurrentUser(currentUser: AuthUser) {
    this.myAttempts = this.isAuthenticated;
  }

  getPage(): Observable<PageResult<ProjectAttempt>> {
    const params: any = {
      page: this.pageNumber,
      project_id: this.project.id,
    };
    if (this.hackathonId) {
      params.hackathonId = this.hackathonId;
    }
    if (this.myAttempts && this.currentUser) {
      return this.repository.listByUsername(this.currentUser.username, params);
    } else {
      return this.repository.list(params);
    }
  }

  myAttemptsClick() {
    this.pageNumber = 1;
    this.reloadPage();
  }
}
