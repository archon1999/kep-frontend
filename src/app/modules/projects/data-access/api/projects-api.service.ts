import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/data-access/api.service';
import { ProjectAttemptLogDto, ProjectDto } from '@projects/data-access';
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProjectsApiService {
  protected readonly api = inject(ApiService);

  getProjects(params?: Record<string, any>): Observable<ProjectDto[]> {
    return this.api.get('projects');
  }

  getProject(id: number | string): Observable<ProjectDto> {
    return this.api.get(`projects/${id}`);
  }

  getProjectAttempts(params: Record<string, any>): Observable<any> {
    return this.api.get('project-attempts', params);
  }

  getAttemptLog(attemptId: number | string): Observable<ProjectAttemptLogDto> {
    return this.api.get(`project-attempts/${attemptId}/log`);
  }

  submitAttempt(
    projectSlug: string,
    technology: string,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('technology', technology);
    return this.api.post(`projects/${projectSlug}/submit`, formData);
  }

  submitHackathonAttempt(
    hackathonId: number | string,
    projectSymbol: string,
    technology: string,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('technology', technology);
    return this.api.post(`hackathons/${hackathonId}/projects/${projectSymbol}/submit`, formData);
  }

  rerun(attemptId: number | string): Observable<any> {
    return this.api.post('project-attempts/' + attemptId + '/rerun/');
  }
}
