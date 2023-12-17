import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "app/auth/service";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ProjectsService } from "./projects.service";

@Injectable()
export class ProjectResolver implements Resolve<any> {
  constructor(
    private service: ProjectsService,
    public router: Router,
    public authService: AuthService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getProject(route.paramMap.get('id')).pipe(
      tap((project: any) => {
        if(!this.authService.currentUserValue?.isSuperuser && project.inThePipeline){          
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
      }),
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );
  }
}
