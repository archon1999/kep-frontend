import { Component, ViewEncapsulation } from '@angular/core';
import { SectionProblemsTableComponent } from '../section-problems-table/section-problems-table.component';
import { CoreCommonModule } from '@core/common.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { DragulaModule } from "ng2-dragula";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { ResourceByIdPipe } from "@shared/pipes/resource-by-id.pipe";
import { ProblemDifficultyColorPipe } from "@problems/pipes/problem-difficulty-color.pipe";

@Component({
  selector: 'section-problems-list',
  standalone: true,
  imports: [
    CoreCommonModule,
    KepPaginationComponent,
    EmptyResultComponent,
    NgxSkeletonLoaderModule,
    KepCardComponent,
    DragulaModule,
    NgbTooltip,
    ResourceByIdPipe,
    ProblemDifficultyColorPipe,
  ],
  templateUrl: './section-problems-list.component.html',
  styleUrl: './section-problems-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionProblemsListComponent extends SectionProblemsTableComponent {
  override defaultPageSize = 20;
  override pageOptions = [10, 20, 50];
}
