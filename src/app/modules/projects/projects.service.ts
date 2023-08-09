import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable()
export class ProjectsService {

  constructor(
    public api: ApiService,
  ) { }

  getProjects(){
    return this.api.get('projects');
  }

  getProject(id: number | string){
    return this.api.get(`projects/${id}`);
  }

  getProjectAttempts(projectId: number | string, page=1){
    return this.api.get('project-attempts', { project_id: projectId, page: page });
  }
  
  getProjectUserAttempts(projectId: number | string, username: string, page=1){
    return this.api.get('project-attempts', { project_id: projectId, page: page, username: username });
  }

  getAttemptLog(attemptId: number | string){
    return this.api.get(`project-attempts/${attemptId}/log`);
  }

  submitAttempt(projectId: number | string, technology: string, file: File){
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('technology', technology);
    return this.api.post(`projects/${projectId}/submit`, formData);
  }

}
