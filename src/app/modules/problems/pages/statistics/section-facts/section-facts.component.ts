import { Component, Input, OnInit } from '@angular/core';
import { ProblemsStatisticsService } from '../../../services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

export interface Facts {
  firstAttempt: any;
  lastAttempt: any;
  firstAccepted: any;
  lastAccepted: any;
  mostAttemptedProblem: any;
  mostAttemptedForSolveProblem: any;
  solvedWithSingleAttempt: number;
  solvedWithSingleAttemptPercentage: number;
}

@Component({
  selector: 'section-facts',
  templateUrl: './section-facts.component.html',
  styleUrls: ['./section-facts.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule],
})
export class SectionFactsComponent implements OnInit {

  @Input() username: string;

  public facts: Facts;

  constructor(
    public statisticsService: ProblemsStatisticsService,
  ) { }

  ngOnInit(): void {
    this.statisticsService.getFacts(this.username).subscribe(
      (facts: Facts) => {
        this.facts = facts;
      }
    );
  }

}
