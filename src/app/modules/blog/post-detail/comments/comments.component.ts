import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@auth';
import { AuthService } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Blog, BlogPostComment } from '../../blog.models';
import { BlogService } from '../../blog.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
  ]
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() blogPost: Blog;

  public comments: Array<BlogPostComment> = [];
  public comment = "";

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: BlogService,
    public authService: AuthService,
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

  deleteComment(index: number){
    let comment = this.comments[index];
    this.service.commentDelete(comment.id).subscribe(
      () => {
        this.comments.splice(index, 1);
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
