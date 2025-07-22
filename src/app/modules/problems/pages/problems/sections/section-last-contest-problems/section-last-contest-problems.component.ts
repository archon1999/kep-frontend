import { Component } from '@angular/core';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@core/common/classes/base-load.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

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
  imports: [CoreCommonModule, ResourceByIdPipe, NgbAccordionModule, KepCardComponent],
  templateUrl: './section-last-contest-problems.component.html',
  styleUrl: './section-last-contest-problems.component.scss',
})
export class SectionLastContestProblemsComponent extends BaseLoadComponent<LastContest> {

  constructor(public apiService: ProblemsApiService) {
    super();
  }

  get contest() {
    return this.data;
  }

  getData() {
    return this.apiService.getLastContest();
  }

}
