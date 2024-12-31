import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BlogService } from './blog.service';

@Injectable()
export class BlogPostExistsGuard implements CanActivate{
    constructor(public service: BlogService, public router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) : Observable<boolean> | boolean {
        let id = route.params['id'];
        return this.service.getBlogPost(id).pipe(
            map((data) => true),
            catchError((err) => {
                this.router.navigate(['/404'], { skipLocationChange: true });
                return of(true);
            })
        )
    }
}
