import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { HomeService } from '../home.service';
import { PageResult } from '@shared/components/classes/page-result';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BlogPostCardModule } from '../../blog/components/blog-post-card/blog-post-card.module';
import { TranslateModule } from '@ngx-translate/core';

const NEWS_MAX_LIMIT = 50;

@Component({
  selector: 'news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
  animations: [fadeInRightOnEnterAnimation({ duration: 3000 })],
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule, SwiperComponent, BlogPostCardModule, TranslateModule]
})
export class NewsSectionComponent implements OnInit, AfterViewInit {

  public lastNews: Array<any> = [];
  public newsCurrentPage = 1;
  public skeletonVisible = true;

  public newsSwiperConfig: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 3,
    autoHeight: false,
    spaceBetween: 10,
  };

  @ViewChild('newsSwiper') newsSwiper: SwiperComponent;

  constructor(
    public service: HomeService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.service.getNews(1, 4).subscribe(
      (result: PageResult) => {
        this.lastNews = result.data;
        this.skeletonVisible = false;
        setTimeout(() => this.newsSwiperOn(), 1000);
      }
    );
  }

  newsSwiperOn() {
    this.newsSwiper.swiper.on('slideChange', () => {
        const index = this.newsSwiper.swiper.realIndex;
        if (index + 3 === this.lastNews.length && index < NEWS_MAX_LIMIT) {
          this.newsCurrentPage++;
          this.service.getNews(this.newsCurrentPage + 1, 2).subscribe(
            (result: PageResult) => {
              this.lastNews = this.lastNews.concat(result.data);
            }
          );
        }
      }
    );
  }
}
