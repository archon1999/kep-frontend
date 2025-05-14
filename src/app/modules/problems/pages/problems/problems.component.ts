import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  SectionStudyPlansComponent
} from '@problems/pages/problems/sections/section-study-plans/section-study-plans.component';
import { SectionTopicsComponent } from '@problems/pages/problems/sections/section-topics/section-topics.component';
import { SectionProblemsFilterComponent } from './sections/section-problems-filter/section-problems-filter.component';
import { SectionProblemsTableComponent } from './sections/section-problems-table/section-problems-table.component';
import { SectionInfoComponent } from '@problems/pages/problems/sections/section-info/section-info.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { BasePageComponent } from '@app/common/classes/base-page.component';
import { SectionHeaderComponent } from '@problems/pages/problems/sections/section-header/section-header.component';
import { SectionCategoriesComponent } from './sections/section-categories/section-categories.component';
import { SectionProblemsListComponent } from './sections/section-problems-list/section-problems-list.component';
import {
  SectionMostViewedProblemsComponent
} from './sections/section-most-viewed-problems/section-most-viewed-problems.component';
import {
  SectionLastContestProblemsComponent
} from './sections/section-last-contest-problems/section-last-contest-problems.component';
import { SectionLastAttemptsComponent } from './sections/section-last-attempts/section-last-attempts.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from "@ngx-translate/core";
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    SectionStudyPlansComponent,
    SectionTopicsComponent,
    SectionProblemsFilterComponent,
    SectionProblemsTableComponent,
    SectionInfoComponent,
    SpinnerComponent,
    NgSelectModule,
    SectionHeaderComponent,
    SectionCategoriesComponent,
    SectionProblemsListComponent,
    SectionMostViewedProblemsComponent,
    SectionLastContestProblemsComponent,
    SectionLastAttemptsComponent,
    NgbNavModule,
    TranslatePipe,
    ContentHeaderModule
  ],
})
export class ProblemsComponent extends BasePageComponent implements OnInit {
  protected override getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Problems',
      breadcrumb: {
        links: [
          {
            name: 'Practice',
            isLink: false,
          },
          {
            name: 'Problems',
            isLink: false,
          },
        ]
      }
    };
  }
}
