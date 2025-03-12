import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from 'app/shared/services/title.service';
import { Blog } from '../blog.models';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
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
