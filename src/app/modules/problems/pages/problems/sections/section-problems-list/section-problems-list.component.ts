import { Component } from '@angular/core';
import { SectionProblemsTableComponent } from '../section-problems-table/section-problems-table.component';
import { CoreCommonModule } from '@core/common.module';
import {
  ProblemCardComponent
} from '@problems/pages/problems/sections/section-problems-list/problem-card/problem-card.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';

@Component({
  selector: 'section-problems-list',
  standalone: true,
  imports: [
    CoreCommonModule,
    ProblemCardComponent,
    KepPaginationComponent,
    EmptyResultComponent,
  ],
  templateUrl: './section-problems-list.component.html',
  styleUrl: './section-problems-list.component.scss'
})
export class SectionProblemsListComponent extends SectionProblemsTableComponent {
  override defaultPageSize = 12;
  override pageOptions = [6, 12, 24, 36];
}
