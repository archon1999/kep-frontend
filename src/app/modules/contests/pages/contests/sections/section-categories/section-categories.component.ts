import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContestsService } from '@contests/contests.service';
import { BaseLoadComponent } from '@core/common/classes/base-load.component';
import { ContestCategory } from '@contests/models';
import { Observable } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'contests-section-categories',
  templateUrl: './section-categories.component.html',
  styleUrls: ['./section-categories.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CoreCommonModule,
    FormsModule,
    NgSelectModule,
    NgxSkeletonLoaderModule,
    KepIconComponent,
  ]
})
export class SectionCategoriesComponent extends BaseLoadComponent<Array<ContestCategory>> implements OnInit {

  @Output() change = new EventEmitter<number>();

  public activeCategory: number | null = null;

  constructor(public service: ContestsService) {
    super();
  }

  get categories() {
    return this.data;
  }

  getData(): Observable<Array<ContestCategory>> {
    return this.service.getContestsCategories();
  }

  categoryChange(categoryId: number | null) {
    this.change.emit(categoryId ?? 0);
  }

}
