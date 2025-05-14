import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectDto, ProjectsApiService } from '@projects/data-access';
import { Project } from '@projects/domain/entities/project';
import { BaseRepository } from "@core/data-access";

@Injectable({
  providedIn: 'root',
})
export class ProjectsRepository implements BaseRepository<ProjectDto, Project> {
  protected readonly projectsApiService = inject(ProjectsApiService);

  list(params?: Record<string, any>): Observable<Project[]> {
    return this.projectsApiService.getProjects(params);
  }

  byId(id: number | string): Observable<Project> {
    return this.projectsApiService.getProject(id);
  }
}
