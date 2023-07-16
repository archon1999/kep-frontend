import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';
import { HomeService } from '../home.service';

@Component({
  selector: 'news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
  animations: [fadeInRightOnEnterAnimation({ duration: 3000 })]
})
export class NewsSectionComponent implements OnInit {

  public lastNews: Array<any> = [];
  public newsCurrentPage = 1;
  public NEWS_MAX_LIMIT = 50;

  public newsSwiperConfig: SwiperOptions = {
    direction: "vertical",
    slidesPerView: 3,
    spaceBetween: 10,
  };

  @ViewChild('newsSwiper') newsSwiper: SwiperComponent;

  constructor(
    public service: HomeService,
  ) { }

  ngOnInit(): void {
    this.service.getNews(1, 4)
      .subscribe((result: any) => {
        this.lastNews = result.data;
        this.newsSwiper.swiper.on('slideChange', () => {
          var index = this.newsSwiper.swiper.realIndex;
          if (index + 3 == this.lastNews.length && index < this.NEWS_MAX_LIMIT) {
            this.newsCurrentPage++;
            this.service.getNews(this.newsCurrentPage + 1, 2)
              .subscribe((result: any) => {
                for (let news of result.data) {
                  this.lastNews.push(news);
                }
              })
          }
        });
      });
  }

}
