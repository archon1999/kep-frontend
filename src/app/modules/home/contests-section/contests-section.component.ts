import { Component, OnInit, ViewChild } from '@angular/core';
import { Contest } from '../../contests/contests.models';
import { HomeService } from '../home.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';

@Component({
  selector: 'app-contests-section',
  templateUrl: './contests-section.component.html',
  styleUrls: ['./contests-section.component.scss']
})
export class ContestsSectionComponent implements OnInit {

  public lastContests: Array<Contest> = [];
  public contestsCurrentPage = 1;
  public contestsSwiperConfig: SwiperOptions = {
    slidesPerView: 1,
    pagination: { el: '.swiper-pagination', clickable: true },
    lazy: true,
    spaceBetween: 30
  };
  @ViewChild('contestsSwiper') contestsSwiper: SwiperComponent;

  constructor(public service: HomeService) {
  }

  ngOnInit(): void {
    this.service.getContests(1, 3)
      .subscribe((result: any) => {
        this.lastContests = result.data.sort((ca, cb) => {
          if (ca.status != cb.status) {
            return +(ca.status < cb.status);
          } else {
            if (ca.status == -1) {
              return -(ca.startTime < cb.startTime);
            } else {
              return +(ca.startTime < cb.startTime);
            }
          }
        }).map(contest => Contest.fromJSON(contest));
        this.contestsSwiper.swiper.on('slideChange', () => {
          var index = this.contestsSwiper.swiper.realIndex;
          if (index + 1 == this.lastContests.length && index < 15) {
            this.contestsCurrentPage++;
            this.service.getContests(this.contestsCurrentPage + 2, 1)
              .subscribe((result: any) => {
                for (let contest of result.data) {
                  this.lastContests.push(contest);
                }
              });
          }
        });
      });
  }

}
