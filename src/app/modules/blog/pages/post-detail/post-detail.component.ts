import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '@shared/services/title.service';
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
    NgbTooltip
  ]
})
export class PostDetailComponent implements OnInit {

  public blogPost: Blog;

  constructor(
    public route: ActivatedRoute,
    public titleService: TitleService,
    public service: BlogService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({blogPost}) => {
      this.blogPost = blogPost;
      this.titleService.updateTitle(this.route, {postTitle: blogPost.title});
    });
  }

  like() {
    this.service.blogLike(this.blogPost.id).subscribe(
      (likes: any) => {
        this.blogPost.likesCount = likes;
      }
    );
  }

}
