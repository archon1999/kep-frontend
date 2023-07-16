import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BlogService } from './blog.service';

@Injectable({
  providedIn: 'root'
})
export class BlogPostResolver implements Resolve<any> {
  constructor(
    public service: BlogService,
    public router: Router,
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.service.getBlogPost(route.paramMap.get('id')).pipe(
      catchError(err => {
        this.router.navigate(['/404'], { skipLocationChange: true });
        return of(true);
      })
    );;
  }
}
