import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { SwiperComponent } from 'ngx-useful-swiper';
import { HomeService } from '../home.service';
import { PageResult } from '@shared/page-result';
import { SwiperOptions } from 'swiper/types/swiper-options';

const NEWS_MAX_LIMIT = 50;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
  animations: [fadeInRightOnEnterAnimation({ duration: 3000 })]
})
export class NewsSectionComponent implements OnInit, AfterViewInit {

  public lastNews: Array<any> = [];
  public newsCurrentPage = 1;
  public skeletonVisible = true;

  public newsSwiperConfig: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 3,
    spaceBetween: 10,
  };

  @ViewChild('newsSwiper') newsSwiper: SwiperComponent;

  constructor(
    public service: HomeService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.service.getNews(1, 4).subscribe(
      (result: PageResult) => {
        this.skeletonVisible = false;
        this.lastNews = result.data;
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
            // tslint:disable-next-line:no-shadowed-variable
            (result: PageResult) => {
              this.lastNews = this.lastNews.concat(result.data);
            }
          );
        }
      }
    );
  }
}
