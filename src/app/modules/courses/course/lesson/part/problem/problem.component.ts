import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { CoursesService } from '../../../../../courses/courses.service';
import { Attempt } from '../../../../../problems/models/attempts.models';
import { Problem } from '../../../../../problems/models/problems.models';

@Component({
  selector: 'part-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit, OnChanges {

  @Input() problem: Problem;
  @Input() lessonPartId: number;
  @Output() checkCompletionEvent = new EventEmitter<any>();

  attempts: Array<Attempt> = [];
 
  currentUser: User = this.authService.currentUserValue;

  constructor(
    public authService: AuthenticationService,
    public api: ApiService,
    public service: CoursesService,
  ) { }

  reloadAttempts(){
    var params = {
      'username': this.currentUser.username,
      'problem_id': this.problem.id,
      'page_size': 10,
      'page': 1,
    };

    this.api.get('attempts', params).subscribe((result: any) => {
      this.attempts = result.data;
    })
  }

  onSubmitted(){
    this.reloadAttempts();
  }
  
  onCheckFinished(data){
    this.service.checkLessonPartCompletion(this.lessonPartId).subscribe((result: any) => {
      this.checkCompletionEvent.emit(result);
    });
  }

  ngOnInit(): void {
    this.reloadAttempts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadAttempts();
  }

}
