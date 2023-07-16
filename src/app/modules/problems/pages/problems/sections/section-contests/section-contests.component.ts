import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contest } from '../../../../../contests/contests.models';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'section-contests',
  templateUrl: './section-contests.component.html',
  styleUrls: ['./section-contests.component.scss'],
  animations: []
})
export class SectionContestsComponent implements OnInit {

  public contests: Array<Contest> = [];

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
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
  }

  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ contests }) => {
      this.contests = contests.map((contest: any) => Contest.fromJSON(contest));
    })
  }

}
