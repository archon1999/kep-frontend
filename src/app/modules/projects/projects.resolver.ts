import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProjectsService } from './projects.service';
import { Project } from '@app/modules/projects/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProjectResolver implements Resolve<any> {
  constructor(
    private service: ProjectsService,
    public router: Router,
    public authService: AuthService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getProject(route.paramMap.get('slug')).pipe(
      tap((project: Project) => {
        if (!this.authService.currentUserValue?.isSuperuser && project.inThePipeline) {
          this.router.navigate(['/404'], {skipLocationChange: true});
        }
      }),
      catchError(err => {
        this.router.navigate(['/404'], {skipLocationChange: true});
        return of(true);
      })
    );
  }
}
