import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bounceAnimation, fadeInOnEnterAnimation, shakeAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { HackAttempt } from '../../../models/hack-attempt.models';

@Component({
  selector: 'base-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    bounceAnimation({ duration: 2000 }),
    shakeAnimation({ duration: 2000 }),
    fadeInOnEnterAnimation(),
  ]
})
export class TableComponent implements OnInit {

  @Input() hackAttempts: Array<HackAttempt> = [];
  @Output() clicked = new EventEmitter<number>();

  public currentUser: User | null;

  constructor(
    public authService: AuthenticationService,
    public service: ProblemsApiService,
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
  }

  rerun(attemptId: number) {
    this.service.hackAttemptRerun(attemptId).subscribe(() => {});
  }

  identify(index: number, item: HackAttempt) {
    return item.id;
  }

}
