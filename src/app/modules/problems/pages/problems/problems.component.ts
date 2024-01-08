import { Component, OnInit } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { SectionStudyPlansComponent } from '@problems/pages/problems/sections/section-study-plans/section-study-plans.component';
import { SectionTopicsComponent } from '@problems/pages/problems/sections/section-topics/section-topics.component';
import { SectionProblemsFilterComponent } from './sections/section-problems-filter/section-problems-filter.component';
import { SectionProblemsTableComponent } from '@problems/pages/problems/sections/section-problems-table/section-problems-table.component';
import { CoreSidebarModule } from '@core/components';
import { NgScrollbar } from 'ngx-scrollbar';
import { SectionSidebarComponent } from '@problems/pages/problems/sections/section-sidebar/section-sidebar.component';
import { SectionInfoComponent } from '@problems/pages/problems/sections/section-info/section-info.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { BasePageComponent } from '@shared/components/classes/base-page.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { SectionHeaderComponent } from '@problems/pages/problems/sections/section-header/section-header.component';
import { SectionCategoriesComponent } from '@problems/pages/problems/sections/section-categories/section-categories.component';
import { SectionProblemsListComponent } from '@problems/pages/problems/sections/section-problems-list/section-problems-list.component';
import {
  SectionMostViewedProblemsComponent
} from '@problems/pages/problems/sections/section-most-viewed-problems/section-most-viewed-problems.component';
import {
  SectionLastContestProblemsComponent
} from '@problems/pages/problems/sections/section-last-contest-problems/section-last-contest-problems.component';
import { SectionLastAttemptsComponent } from '@problems/pages/problems/sections/section-last-attempts/section-last-attempts.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    SectionStudyPlansComponent,
    SectionTopicsComponent,
    SectionProblemsFilterComponent,
    SectionProblemsTableComponent,
    CoreSidebarModule,
    NgScrollbar,
    SectionSidebarComponent,
    SectionInfoComponent,
    SpinnerComponent,
    NgSelectModule,
    ContentHeaderModule,
    SectionHeaderComponent,
    SectionCategoriesComponent,
    SectionProblemsListComponent,
    SectionMostViewedProblemsComponent,
    SectionLastContestProblemsComponent,
    SectionLastAttemptsComponent,
    NgbNavModule
  ],
})
export class ProblemsComponent extends BasePageComponent implements OnInit {
  ngOnInit() {
    this.loadContentHeader();
  }

  toggleSidebar(key): void {
    this.coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Problems',
      breadcrumb: {
        links: [
          {
            name: this.coreConfig.app.appTitle,
            isLink: true,
            link: '/',
          }
        ]
      }
    };
  }
}
