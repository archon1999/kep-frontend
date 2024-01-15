import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestsService } from '@contests/contests.service';
import { BaseLoadComponent } from '@shared/components/classes/base-load.component';
import { ContestCategory } from '@contests/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'contests-section-categories',
  templateUrl: './section-categories.component.html',
  styleUrls: ['./section-categories.component.scss'],
  animations: [fadeInRightOnEnterAnimation({ duration: 1000 })],
  standalone: true,
  imports: [
    CoreCommonModule,
    SwiperComponent,
    NgbTooltipModule,
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
