import { Component } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreCommonModule } from '@core/common.module';
import { SectionStudyPlansComponent } from '@problems/pages/problems/sections/section-study-plans/section-study-plans.component';
import { SectionTopicsComponent } from '@problems/pages/problems/sections/section-topics/section-topics.component';
import { SectionProblemsFilterComponent } from './sections/section-problems-filter/section-problems-filter.component';
import { SectionProblemsTableComponent } from '@problems/pages/problems/sections/section-problems-table/section-problems-table.component';
import { CoreSidebarModule } from '@core/components';
import { NgScrollbar } from 'ngx-scrollbar';
import { SectionSidebarComponent } from '@problems/pages/problems/sections/section-sidebar/section-sidebar.component';
import { SectionInfoComponent } from '@problems/pages/problems/sections/section-info/section-info.component';
import { BaseComponent } from '@shared/components/classes/base.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

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
  ],
})
export class ProblemsComponent extends BaseComponent {
  constructor(
    public coreSidebarService: CoreSidebarService,
  ) {
    super();
  }

  toggleSidebar(key): void {
    this.coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }
}
