import { Component, Input, OnInit } from '@angular/core';
import { ProblemsStatisticsService } from '../../../services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

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
  imports: [CoreCommonModule, NgbTooltipModule, ResourceByIdPipe],
})
export class SectionFactsComponent implements OnInit {

  @Input() username: string;

  public facts: Facts;
  protected readonly Resources = Resources;

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
