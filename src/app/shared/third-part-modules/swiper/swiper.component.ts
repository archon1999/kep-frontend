import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { A11y, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { SwiperDirective } from '@shared/directives/swiper.directive';

@Component({
  selector: 'swiper',
  standalone: true,
  imports: [CommonModule, SwiperDirective],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements OnInit {

  @Input() config: SwiperOptions;
  @Input() height: number;
  @ViewChild('swiper') swiperRef: ElementRef;

  public defaultConfig = {
    modules: [Navigation, Pagination, A11y, Mousewheel],
    spaceBetween: 30,
    autoHeight: true,
  };

  get swiper() {
    return this.swiperRef.nativeElement.swiper;
  }

  ngOnInit() {
    this.config = {
      ...this.defaultConfig,
      ...this.config,
    };
  }

}
