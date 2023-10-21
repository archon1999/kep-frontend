import { Component, Input, OnInit } from '@angular/core';
import { Contest, ContestProblem } from '../../contests.models';
import { ContestsService } from '../../contests.service';
import { Problem } from 'app/modules/problems/models/problems.models';
import { CoreConfigService } from '@core/services/config.service';
import { BaseComponent } from '../../../../shared/components/classes/base.component';
import { takeUntil } from 'rxjs/operators';
import { CoreConfig } from '@core/types';
import { AuthenticationService } from 'app/auth/service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contest-problem-card',
  templateUrl: './contest-problem-card.component.html',
  styleUrls: ['./contest-problem-card.component.scss', '../../contests.colors.scss']
})
export class ContestProblemCardComponent extends BaseComponent implements OnInit {

  @Input() contest: Contest;
  @Input() contestProblem: ContestProblem;

  public problem: Problem;

  constructor(
    public service: ContestsService,
    public coreConfigService: CoreConfigService,
  ) {
    super();
  }

  ngOnInit(): void {}

  onProblemFocus(symbol: string){
    this.service.getContestProblem(this.contest.id, this.contestProblem.symbol).subscribe(
      (result: any) => {
        this.problem = result.problem;
      }
    );
  }

  removeProblem(){
    this.problem = null;
  }

}
