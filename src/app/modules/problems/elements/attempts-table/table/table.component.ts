import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bounceAnimation, shakeAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Contest } from 'app/modules/contests/contests.models';
import { Attempt } from 'app/modules/problems/attempts.models';
import { ProblemsService } from 'app/modules/problems/problems.service';

@Component({
  selector: 'base-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [bounceAnimation({ duration: 2000 }), shakeAnimation({ duration: 2000 })]
})
export class TableComponent implements OnInit {
  @Input() contest: Contest;
  @Input() hideSourceCodeSize = false;
  @Input() attempts: Array<Attempt> = [];
  @Output() clicked = new EventEmitter<number>();

  public currentUser: User | null;

  constructor(
    public authService: AuthenticationService,
    public service: ProblemsService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
  }

  rerun(attemptId: number){
    this.service.attemptRerun(attemptId).subscribe(() => {})
  }

}
