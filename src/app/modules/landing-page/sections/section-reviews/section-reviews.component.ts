import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Review } from '@app/modules/landing-page/sections/section-reviews/review';
import { Observable, of } from 'rxjs';
import { ReviewCardComponent } from '@app/modules/landing-page/sections/section-reviews/review-card/review-card.component';

@Component({
  selector: 'section-reviews',
  standalone: true,
  imports: [CoreCommonModule, SwiperComponent, ReviewCardComponent],
  templateUrl: './section-reviews.component.html',
  styleUrl: './section-reviews.component.scss'
})
export class SectionReviewsComponent extends BaseLoadComponent<Array<Review>> {

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    autoHeight: false,
    autoplay: {
      delay: 2500,
      disableOnInteraction: true,
    },
    loop: true,
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 30
      },
    }
  };

  getData(): Observable<Array<Review>> {
    return of([
      {
        username: 'MDSPro',
        avatar: 'https://cpython.s3.amazonaws.com/media/images/avatars/MDSPro.webp',
        firstName: 'Davlatbek',
        lastName: 'Mirakilov',
        datetime: '2023-04-01',
        text: 'Sabab va maqsad? Sizni nima qiziqtirmoqda? Nima bo`lganda ham ushbu sayt O`zbekiston hudida dasturlashga va dasturlash tillariga bo`lgan qiziquvchi odamlarni jamlash va ularning bilimlarini oshirish uchun ishlab chiqilgan. Fikrim shunaqa!',
      },
      {
        username: 'Azizjon_ps',
        avatar: 'https://cpython.s3.amazonaws.com/media/images/avatars/Azizjon_ps_LkpeXykG.webp',
        firstName: 'Azizjon',
        lastName: 'Ilxomov',
        datetime: '2023-04-01',
        text: 'Shu Nazar aka o`ziga xotin topolmaginidan zerikishdan biron bir sayt yaratish kerak deb yaratvorgan)))',
      },
      {
        username: 'drdilyor',
        avatar: 'https://cpython.s3.amazonaws.com/media/images/avatars/drdilyor_D7rxQbqD.webp',
        firstName: 'Dilyor',
        lastName: 'Valijanov',
        datetime: '2024-01-21',
        text: 'Ko\'p dasturlash platformalari bor, ba\'zilari qiziqarli masalalar uchun, ba\'zilar qisqa kod yozish, boshqalari esa tez dastur tuzish. Kep.uzda esa hamma turdagi praktika usullari bir joyga jamlangandir.',
      },
      {
        username: 'MDSPro',
        avatar: 'https://cpython.s3.amazonaws.com/media/images/avatars/MDSPro.webp',
        firstName: 'Davlatbek',
        lastName: 'Mirakilov',
        datetime: '2023-07-01',
        text: 'Sabab va maqsad? Sizni nima qiziqtirmoqda? Nima bo`lganda ham ushbu sayt O`zbekiston hudida dasturlashga va dasturlash tillariga bo`lgan qiziquvchi odamlarni jamlash va ularning bilimlarini oshirish uchun ishlab chiqilgan. Fikrim shunaqa!',
      },
    ]);
  }
}
