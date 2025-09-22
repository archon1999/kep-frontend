import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bounceAnimation, shakeAnimation } from 'angular-animations';
import { AuthService, AuthUser } from '@auth';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { HackAttempt } from '../../../models/hack-attempt.models';
import { Resources } from '@app/resources';

@Component({
  selector: 'base-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    bounceAnimation({duration: 2000}),
    shakeAnimation({duration: 2000}),
  ],
  standalone: false,
})
export class TableComponent implements OnInit {

  @Input() hackAttempts: Array<HackAttempt> = [];
  @Output() clicked = new EventEmitter<number>();

  public currentUser: AuthUser | null;

  constructor(
    public authService: AuthService,
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

  protected readonly Resources = Resources;
}
