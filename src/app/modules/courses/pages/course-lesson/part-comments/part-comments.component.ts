import { Component, Input, OnInit } from '@angular/core';
import { AuthService, AuthUser } from '@auth';
import { CoursesService } from '@courses/courses.service';
import { CoreCommonModule } from '@core/common.module';
import { CourseLessonPartComment } from '@courses/interfaces';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'lesson-part-comments',
  templateUrl: './part-comments.component.html',
  styleUrls: ['./part-comments.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    UserPopoverModule,
    QuillEditorComponent,
  ]
})
export class PartCommentsComponent implements OnInit {

  @Input() comments: Array<CourseLessonPartComment>;
  @Input() lessonPartId: number;

  comment = '';

  currentUser: AuthUser = this.authService.currentUserValue;

  constructor(
    public service: CoursesService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  commentSubmit() {
    if (this.comment.length > 0) {
      this.service.submitComment(this.lessonPartId, this.comment).subscribe((result: any) => {
        this.service.getCourseLessonPartComments(this.lessonPartId).subscribe((result: any) => {
          this.comments = result;
        });
      });
    }
  }

  emojiClick(commentId: number, emoji: number) {
    this.service.emojiCourseLessonPartComment(commentId, emoji).subscribe((result: any) => {
      for (const comment of this.comments) {
        if (commentId === comment.id) {
          comment.likes = result.likes;
          comment.dislikes = result.dislikes;
        }
      }
    });
  }

  commentDelete(commentId: number) {
    this.service.deleteCourseLessonPartComment(commentId).subscribe((result: any) => {
      if (result.success) {
        for (let i = 0; i < this.comments.length; i++) {
          if (commentId === this.comments[i].id) {
            this.comments.splice(i, 1);
          }
        }
      }
    });
  }

}
