import { Component, inject } from '@angular/core';
import { Blog } from '@app/modules/blog/blog.interfaces';
import { CoreCommonModule } from '@core/common.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { BlogPostCardComponent } from '@app/modules/blog/components/blog-post-card/blog-post-card.component';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { UsersApiService } from "@app/modules/users";

@Component({
  selector: 'user-blog',
  templateUrl: './user-blog.component.html',
  styleUrls: ['./user-blog.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    SpinnerComponent,
    BlogPostCardComponent,
    EmptyResultComponent,
    KepCardComponent,
  ]
})
export class UserBlogComponent extends BaseLoadComponent<PageResult<Blog>> {
  protected usersService = inject(UsersApiService);

  getData(): Observable<PageResult<Blog>> {
    return this.usersService.getUserBlog(this.route.snapshot.parent.params.username, { pageSize: 3 });
  }
}
