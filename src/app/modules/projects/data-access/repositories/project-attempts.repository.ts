import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectAttemptDto, ProjectsApiService } from '@projects/data-access';
import { BaseRepository } from "@core/data-access";
import { PageResult } from "@app/common/classes/page-result";
import { ProjectAttempt, ProjectAttemptLog } from "@projects/domain/entities";

@Injectable({
  providedIn: 'root',
})
export class ProjectAttemptsRepository implements BaseRepository<ProjectAttemptDto, ProjectAttempt> {
  protected readonly projectsApiService = inject(ProjectsApiService);

  list(params: Record<string, any>): Observable<PageResult<ProjectAttempt>> {
    return this.projectsApiService.getProjectAttempts(params);
  }

  listByUsername(username: string, params): Observable<PageResult<ProjectAttempt>> {
    return this.projectsApiService.getProjectAttempts({
      username,
      ...params,
    })
  }

  getAttemptLog(attemptId: number | string): Observable<ProjectAttemptLog> {
    return this.projectsApiService.getAttemptLog(attemptId);
  }

  submitAttempt(
    projectSlug: string,
    technology: string,
    file: File
  ) {
    return this.projectsApiService.submitAttempt(projectSlug, technology, file);
  }
}
