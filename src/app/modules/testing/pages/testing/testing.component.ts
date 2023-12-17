import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Chapter, Test } from '../../testing.models';
import { TestingApiService } from '../../testing-api.service';
import { SwiperOptions } from 'swiper/types/swiper-options';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  animations: [],
  encapsulation: ViewEncapsulation.None,
})
export class TestingComponent implements OnInit, OnDestroy {

  public chapters: Array<Chapter> = [];
  public lastTests: Array<Test> = [];
  public tests: Array<Test> = [];

  public selectedChapter = 0;
  public currentPage = 1;
  public isLastPage = true;

  public testsSwiperConfig: SwiperOptions = {
    breakpoints: {
      1300: {
        slidesPerView: 5,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      500: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 20
      },
    }
  };

  public chaptersSwiperConfig: SwiperOptions = {
    breakpoints: {
      1300: {
        slidesPerView: 5,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      500: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 20
      },
    }
  };

  private _unsubscribeAll = new Subject();

  constructor(
    public service: TestingApiService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ chapters, lastTests }) => {
      this.chapters = chapters;
      this.lastTests = lastTests.data;
    });

    this.loadTests();
  }

  loadTests() {
    const params: any = {};
    if (this.selectedChapter) {
      params.chapter_id = this.selectedChapter;
    }
    this.service.getTests(params).subscribe(
      (result: any) => {
        this.tests = result.data;
        if (result.total != this.tests.length) {
          this.isLastPage = false;
        }
      }
    );
  }

  moreLoad() {
    this.currentPage++;
    const params: any = {
      page: this.currentPage,
    };
    if (this.selectedChapter) {
      params.chapter_id = this.selectedChapter;
    }
    this.service.getTests(params).subscribe(
      (result: any) => {
        this.tests = this.tests.concat(result.data);
        if (result.total == this.tests.length) {
          this.isLastPage = true;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
