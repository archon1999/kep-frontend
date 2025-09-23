import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SectionProblemsFilterComponent } from './sections/section-problems-filter/section-problems-filter.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { SectionHeaderComponent } from '@problems/pages/problems/sections/section-header/section-header.component';
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
import { SectionSummaryComponent } from "@problems/pages/problems/sections/section-summary/section-summary.component";
import {
  SectionDifficultiesComponent
} from "@problems/pages/problems/sections/section-difficulties/section-difficulties.component";

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    SectionProblemsFilterComponent,
    NgSelectModule,
    SectionHeaderComponent,
    SectionProblemsListComponent,
    SectionMostViewedProblemsComponent,
    SectionLastContestProblemsComponent,
    SectionLastAttemptsComponent,
    NgbNavModule,
    TranslatePipe,
    ContentHeaderModule,
    SectionSummaryComponent,
    SectionDifficultiesComponent
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
