import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CoreCommonModule } from '@core/common.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'contests-section-categories',
  templateUrl: './contests-section-categories.component.html',
  styleUrls: ['./contests-section-categories.component.scss'],
  animations: [fadeInRightOnEnterAnimation({ duration: 1000 })],
  standalone: true,
  imports: [
    CoreCommonModule,
    SwiperComponent,
    NgbTooltipModule,
  ]
})
export class ContestsSectionCategoriesComponent implements OnInit {

  public activeCategory = 0;

  @Output() change = new EventEmitter<number>();

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    breakpoints: {
      1024: {
        slidesPerView: 7,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 30
      },
      472: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 2,
        spaceBetween: 30
      },
    }
  };

  constructor() {
  }

  ngOnInit(): void {
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
