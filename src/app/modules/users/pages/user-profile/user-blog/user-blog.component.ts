import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '@app/modules/blog/blog.models';
import { CoreCommonModule } from '@core/common.module';
import { BlogPostCardModule } from '@app/modules/blog/components/blog-post-card/blog-post-card.module';
import { UsersApiService } from '@users/users-api.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { PageResult } from '@app/common/classes/page-result';

@Component({
  selector: 'user-blog',
  templateUrl: './user-blog.component.html',
  styleUrls: ['./user-blog.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    BlogPostCardModule,
    SpinnerComponent,
  ]
})
export class UserBlogComponent implements OnInit {

  public userBlog: Array<Blog> = [];
  public isLoading = true;

  constructor(
    public service: UsersApiService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.service.getUserBlog(params.get('username'), { pageSize: 3 }).subscribe(
          (result: PageResult<Blog>) => {
            this.isLoading = false;
            this.userBlog = result.data;
          }
        );
      }
    );
  }

}
