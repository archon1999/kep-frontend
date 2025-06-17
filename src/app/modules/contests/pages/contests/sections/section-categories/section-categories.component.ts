import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestsService } from '@contests/contests.service';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { ContestCategory } from '@contests/models';
import { Observable } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'contests-section-categories',
  templateUrl: './section-categories.component.html',
  styleUrls: ['./section-categories.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    NgxSkeletonLoaderModule,
    KepCardComponent,
  ]
})
export class SectionCategoriesComponent extends BaseLoadComponent<Array<ContestCategory>> implements OnInit {

  @Output() change = new EventEmitter<number>();

  public activeCategory = 0;

  constructor(public service: ContestsService) {
    super();
  }

  get categories() {
    return this.data;
  }

  getData(): Observable<Array<ContestCategory>> {
    return this.service.getContestsCategories();
  }

  click(categoryId: number) {
    if (categoryId === this.activeCategory) {
      this.activeCategory = 0;
    } else {
      this.activeCategory = categoryId;
    }
    this.change.emit(this.activeCategory);
  }

}
