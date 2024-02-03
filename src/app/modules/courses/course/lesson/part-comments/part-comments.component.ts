import { Component, Input, OnInit } from '@angular/core';
import { User } from '@auth';
import { AuthService } from '@auth';
import { CourseLessonPartComment } from '../../../../courses/courses.models';
import { CoursesService } from '../../../../courses/courses.service';

@Component({
  selector: 'lesson-part-comments',
  templateUrl: './part-comments.component.html',
  styleUrls: ['./part-comments.component.scss']
})
export class PartCommentsComponent implements OnInit {

  @Input() comments: Array<CourseLessonPartComment>;
  @Input() lessonPartId: number;

  comment = "";

  currentUser: User = this.authService.currentUserValue;

  constructor(
    public service: CoursesService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  commentSubmit(){
    if(this.comment.length > 0){
      this.service.submitComment(this.lessonPartId, this.comment).subscribe((result: any) => {
        this.service.getCourseLessonPartComments(this.lessonPartId).subscribe((result: any) => {
          this.comments = result;  
        });
      });
    }
  }

  emojiClick(commentId: number, emoji: number){
    this.service.emojiCourseLessonPartComment(commentId, emoji).subscribe((result: any) => {
      for(let comment of this.comments){
        if(commentId == comment.id){
          comment.likes = result.likes;
          comment.dislikes = result.dislikes;
        }
      }
    });
  }

  commentDelete(commentId: number){
    this.service.deleteCourseLessonPartComment(commentId).subscribe((result: any) => {
      if(result.success){
        for(var i = 0; i < this.comments.length; i++){
          if(commentId == this.comments[i].id){
            this.comments.splice(i, 1);
          }
        }          
      }
    });
  }

}
