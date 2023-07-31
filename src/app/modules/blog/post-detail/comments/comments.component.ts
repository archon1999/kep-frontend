import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Blog, BlogPostComment } from '../../blog.models';
import { BlogService } from '../../blog.service';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() blogPost: Blog;

  public comments: Array<BlogPostComment> = [];
  public comment = "";

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: BlogService,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: any) => {
      this.currentUser = user;
    })

    this.updateComments();
  }

  updateComments(){
    this.service.getBlogPostComments(this.blogPost.id).subscribe(
      (comments: any) => {
        this.comments = comments;
      }
    )
  }

  submit(){
    if(this.comment){
      this.service.commentPost(this.blogPost.id, this.comment).subscribe(
        () => {
          this.updateComments();
        }
      )
    }
  }

  like(index: number) {
    this.service.commentLike(this.comments[index].id).subscribe(
      (likes: any) => {
        this.comments[index].likes = likes;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
