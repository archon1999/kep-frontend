import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog } from '../../blog/blog.models';
import { HomeService } from '../home.service';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { BlogPostCardModule } from '../../blog/components/blog-post-card/blog-post-card.module';
import { PageResult } from '@app/common/classes/page-result';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

const PAGE_SIZE = 6;

@Component({
  selector: 'posts-section',
  standalone: true,
  imports: [CommonModule, SwiperComponent, BlogPostCardModule, SpinnerComponent],
  templateUrl: './posts-section.component.html',
  styleUrl: './posts-section.component.scss'
})
export class PostsSectionComponent implements AfterViewInit {

  public lastPosts: Array<Blog> = [];

  public postsSwiperConfig: SwiperOptions = {
    autoHeight: false,
    pagination: true,
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 50
      },
    }
  };

  @ViewChild('postsSwiper') postsSwiper: SwiperComponent;

  constructor(public service: HomeService) {}

  ngAfterViewInit() {
    this.service.getLastPosts(1, PAGE_SIZE).subscribe(
      (result: PageResult<Blog>) => {
        this.lastPosts = result.data;
      }
    );
  }

}
