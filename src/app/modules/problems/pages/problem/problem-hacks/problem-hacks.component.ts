import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { Problem } from '../../../models/problems.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { CurrentUser } from '../../../../../shared/components/classes/current-user.component';
import { PageResult } from '../../../../../shared/page-result';
import { HackAttempt } from '../../../models/hack-attempt.models';

@Component({
  selector: 'problem-hacks',
  templateUrl: './problem-hacks.component.html',
  styleUrls: ['./problem-hacks.component.scss']
})
export class ProblemHacksComponent extends CurrentUser implements OnInit {

  @Input() problem: Problem;

  public hackAttempts: Array<HackAttempt> = [];
  public totalAttemptsCount = 0;
  public currentPage = 1;
  public myAttempts = true;

  constructor(
    public authService: AuthenticationService,
    public service: ProblemsService,
  ) {
    super(authService);
  }

  ngOnInit(): void {
    this.loadHackAttempts();
  }

  loadHackAttempts() {
    this.service.getHackAttempts({problemId: this.problem.id}).subscribe(
      (result: PageResult) => {
        this.hackAttempts = result.data;
        this.totalAttemptsCount = result.total;
      }
    );
  }

}
