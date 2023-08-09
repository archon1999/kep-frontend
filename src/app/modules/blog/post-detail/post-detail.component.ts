import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from 'app/shared/services/title.service';
import { Blog } from '../blog.models';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {

  public blogPost: Blog;

  constructor(
    public route: ActivatedRoute,
    public titleService: TitleService,
    public service: BlogService,
  ) { }

  ngOnInit(): void {
    document.getElementsByTagName('body')[0].classList.add('post-detail-page');
    this.route.data.subscribe(({ blogPost }) => {
      this.blogPost = blogPost;
      this.titleService.updateTitle(this.route, { postTitle: blogPost.title });
    })

  }

  like() {
    this.service.blogLike(this.blogPost.id).subscribe(
      (likes: any) => {
        this.blogPost.likesCount = likes;
      }
    )
  }

  ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('post-detail-page');
  }

}
