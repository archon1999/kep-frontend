import { Component, inject } from '@angular/core';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { Blog } from '../../blog.interfaces';
import { BlogService } from '../../blog.service';
import { BaseTablePageComponent } from '@app/common';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { BlogPostCardComponent } from '@app/modules/blog/components/blog-post-card/blog-post-card.component';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  standalone: true,
  imports: [
    ContentHeaderModule,
    BlogPostCardComponent,
    CoreDirectivesModule,
    FormsModule,
    NgSelectComponent,
    NgOptionComponent,
    TranslatePipe,
    NgClass,
    KepPaginationComponent,
    KepCardComponent
  ]
})
export class BlogListComponent extends BaseTablePageComponent<Blog> {
  override maxSize = 5;

  public allAuthors = [];
  public filter = {
    title: '',
    author: null,
    orderBy: null,
    topic: 0,
  };

  protected blogService = inject(BlogService);

  ngOnInit(): void {
    super.ngOnInit();
    this.blogService.getAllAuthors().subscribe(
      (result: any) => {
        this.allAuthors = result;
      }
    );
  }

  getPage(): Observable<PageResult<Blog>> {
    return this.blogService.getBlogPosts({
      ...this.filter,
      ...this.pageable,
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Blog',
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.appStateService.getCurrentValue().appTitle,
            isLink: false,
          },
        ]
      }
    };
  }
}
