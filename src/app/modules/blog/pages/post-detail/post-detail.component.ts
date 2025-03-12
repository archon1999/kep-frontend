import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Blog } from '../../blog.interfaces';
import { BlogService } from '../../blog.service';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { TranslatePipe } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CommentsComponent } from '@app/modules/blog/pages/post-detail/comments/comments.component';
import { IconNamePipe } from '@shared/pipes/feather-icons.pipe';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    KepCardComponent,
    UserPopoverModule,
    MathjaxModule,
    TranslatePipe,
    CoreDirectivesModule,
    CommentsComponent,
    IconNamePipe,
    NgbTooltip,
    SpinnerComponent
  ]
})
export class PostDetailComponent extends BaseLoadComponent<Blog> {
  protected blogService = inject(BlogService);

  get blog() {
    return this.data;
  }

  getData(): Observable<Blog> {
    return this.blogService.getBlogPost(this.route.snapshot.params.id);
  }

  afterLoadData(blog: Blog) {
    this.titleService.updateTitle(this.route, { postTitle: this.blog.title });
  }

  like() {
    this.blogService.blogLike(this.blog.id).subscribe(
      (likes: any) => {
        this.blog.likesCount = likes;
      }
    );
  }
}
