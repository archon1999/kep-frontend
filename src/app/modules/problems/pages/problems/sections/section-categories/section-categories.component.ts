import { Component } from '@angular/core';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Category } from '@problems/models/problems.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'section-categories',
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule],
  templateUrl: './section-categories.component.html',
  styleUrl: './section-categories.component.scss',
  animations: [fadeInOnEnterAnimation()]
})
export class SectionCategoriesComponent extends BaseLoadComponent<Array<Category>> {

  public showAll = true;

  constructor(
    public service: ProblemsApiService
  ) {
    super();
  }

  get categories() {
    return this.data;
  }

  getData(): Observable<Array<Category>> | null {
    return this.service.getCategories();
  }

}
