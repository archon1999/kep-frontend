import { Component, Input, OnInit } from '@angular/core';
import { ProblemsStatisticsService } from '../../../services/problems-statistics.service';

export interface Facts {
  firstAttempt: any;
  lastAttempt: any;
  firstAccepted: any;
  lastAccepted: any;
  mostAttemptedProblem: any;
  mostAttemptedForSolveProblem: any;
  solvedWithSingleAttempt: any;
}
@Component({
  selector: 'section-facts',
  templateUrl: './section-facts.component.html',
  styleUrls: ['./section-facts.component.scss']
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
    )
  }

}
