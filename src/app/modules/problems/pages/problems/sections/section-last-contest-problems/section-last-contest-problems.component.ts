import { Component, ViewEncapsulation } from '@angular/core';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Router } from '@angular/router';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@shared/components/classes/base-load.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

interface LastContest {
  id: number;
  title: string;
  problems: Array<{
    id: number,
    symbol: string,
    title: string,
  }>;
}

@Component({
  selector: 'section-last-contest-problems',
  standalone: true,
  imports: [CoreCommonModule, ResourceByIdPipe, NgbAccordionModule],
  templateUrl: './section-last-contest-problems.component.html',
  styleUrl: './section-last-contest-problems.component.scss',
})
export class SectionLastContestProblemsComponent extends BaseLoadComponent<LastContest> {

  constructor(public apiService: ProblemsApiService, public router: Router) {
    super();
  }

  get contest() {
    return this.data;
  }

  getData() {
    return this.apiService.getLastContest();
  }

}
