import { AfterViewInit, Component } from '@angular/core';

import { Blog } from '../../blog/blog.models';
import { HomeService } from '../home.service';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { BlogPostCardModule } from '../../blog/components/blog-post-card/blog-post-card.module';
import { PageResult } from '@app/common/classes/page-result';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

const PAGE_SIZE = 6;

@Component({
  selector: 'posts-section',
  standalone: true,
  imports: [SwiperComponent, BlogPostCardModule, SpinnerComponent, CarouselModule, KepCardComponent],
  templateUrl: './posts-section.component.html',
  styleUrl: './posts-section.component.scss'
})
export class PostsSectionComponent implements AfterViewInit {

  public lastPosts: Array<Blog> = [];
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 100,
    autoplay: false,
    navText: ['<', '>'],
    autoplaySpeed: 5000,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
    },
    nav: false,
  };

  constructor(public service: HomeService) {}

  ngAfterViewInit() {
    this.service.getLastPosts(1, PAGE_SIZE).subscribe(
      (result: PageResult<Blog>) => {
        this.lastPosts = result.data;
      }
    );
  }

}
