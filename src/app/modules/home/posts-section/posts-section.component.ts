import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog } from '../../blog/blog.models';
import { HomeService } from '../home.service';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { BlogPostCardModule } from '../../blog/components/blog-post-card/blog-post-card.module';
import { PageResult } from '@shared/page-result';

@Component({
  selector: 'posts-section',
  standalone: true,
  imports: [CommonModule, SwiperComponent, BlogPostCardModule],
  templateUrl: './posts-section.component.html',
  styleUrl: './posts-section.component.scss'
})
export class PostsSectionComponent implements OnInit {

  public lastPosts: Array<Blog> = [];
  public lastPostsPage = 1;

  public postsSwiperConfig: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
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

  ngOnInit() {
    this.service.getLastPosts(1, 3).subscribe(
      (result: PageResult<Blog>) => {
        this.lastPosts = result.data;
        this.postsSwiper.swiper.on('slideChange', () => {
            const index = this.postsSwiper.swiper.realIndex;
            if (index + 2 >= this.lastPosts.length && index < 50) {
              this.lastPostsPage++;
              this.service.getLastPosts(this.lastPostsPage, 3).subscribe(
                (result: PageResult<Blog>) => {
                  for (const post of result.data) {
                    this.lastPosts.push(post);
                  }
                }
              );
            }
          }
        );
      }
    );
  }
}
