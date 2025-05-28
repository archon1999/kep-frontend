import { Component } from '@angular/core';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Problem } from '@problems/models/problems.models';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { CoreCommonModule } from '@core/common.module';
import { getResourceById, Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { randomChoice } from '@shared/utils/random';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-most-viewed',
  standalone: true,
  imports: [CoreCommonModule, KepIconComponent, ResourceByIdPipe, NgbAccordionModule, KepCardComponent],
  templateUrl: './section-most-viewed-problems.component.html',
  styleUrl: './section-most-viewed-problems.component.scss',
})
export class SectionMostViewedProblemsComponent extends BaseLoadComponent<Array<Partial<Problem>>> {

  get problems() {
    return this.data;
  }

  constructor(public apiService: ProblemsApiService) {
    super();
  }

  getData() {
    return this.apiService.getMostViewedProblems();
  }

  pickOne() {
    const problem = randomChoice(this.problems);
    this.router.navigateByUrl(getResourceById(Resources.Problem, problem.id));
  }

}
