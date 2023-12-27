import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';

@Component({
  selector: 'problem1903',
  standalone: true,
  imports: [
    CoreCommonModule,
    SwiperComponent
  ],
  templateUrl: './problem1903.component.html',
  styleUrl: './problem1903.component.scss'
})
export class Problem1903Component {

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    autoHeight: false,
    spaceBetween: 10,
    loop: true,
  };

}
