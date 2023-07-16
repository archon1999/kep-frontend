import { Component, OnInit } from '@angular/core';
import { Contest } from '../../../../contests/contests.models';
import { ContestsService } from '../../../../contests/contests.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'slide-contests',
  templateUrl: './slide-contests.component.html',
  styleUrls: ['./slide-contests.component.scss']
})
export class SlideContestsComponent implements OnInit {

  public contests: Array<Contest> = [];

  public contestsSwiperConfig: SwiperOptions = {
    slidesPerView: 1,
    pagination: { el: '.swiper-pagination', clickable: true },
    lazy: true,
    spaceBetween: 30
  }

  constructor(
    public contestsService: ContestsService,
  ) { }

  ngOnInit(): void {
    this.contestsService.getUpcomingContests().subscribe(
      (result: any) => {
        this.contests = result.data.map((contest: Contest) => Contest.fromJSON(contest));
      }
    )
  }

}
