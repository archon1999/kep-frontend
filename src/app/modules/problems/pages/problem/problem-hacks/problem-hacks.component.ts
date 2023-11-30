import { Component, Input, OnInit } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { BaseComponent } from '@shared/components/classes/base.component';
import { PageResult } from '@shared/page-result';
import { HackAttempt } from '@problems/models/hack-attempt.models';
import { CoreCommonModule } from '@core/common.module';
import { KepPaginationComponent, } from '@shared/components/pagination/kep-pagination.component';
import { HackAttemptsTableModule } from '@problems/components/hack-attempts-table/hack-attempts-table.module';

@Component({
  selector: 'problem-hacks',
  templateUrl: './problem-hacks.component.html',
  styleUrls: ['./problem-hacks.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepPaginationComponent,
    HackAttemptsTableModule,
  ]
})
export class ProblemHacksComponent extends BaseComponent implements OnInit {

  @Input() problem: Problem;

  public hackAttempts: Array<HackAttempt> = [];
  public totalAttemptsCount = 0;
  public currentPage = 1;
  public myAttempts = true;

  constructor(
    public service: ProblemsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadHackAttempts();
  }

  loadHackAttempts() {
    this.service.getHackAttempts({ problemId: this.problem.id }).subscribe(
      (result: PageResult) => {
        this.hackAttempts = result.data;
        this.totalAttemptsCount = result.total;
      }
    );
  }

}
