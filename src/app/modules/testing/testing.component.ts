import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { Subject } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { Chapter, Test } from './testing.models';
import { TestingService } from './testing.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss', './chapters.scss'],
  animations: [],
})
export class TestingComponent implements OnInit, OnDestroy {

  public chapters: Array<Chapter> = [];
  public lastTests: Array<Test> = [];
  public tests: Array<Test> = [];

  public selectedChapter = 0;
  public currentPage = 1;
  public isLastPage = true;
  
  public testsSwiperConfig: SwiperOptions = {
    lazy: true,
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
  }

  public chaptersSwiperConfig: SwiperOptions = {
    lazy: true,
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
  }
  
  private _unsubscribeAll = new Subject();
  
  constructor(
    public service: TestingService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ chapters, lastTests }) => {
      this.chapters = chapters;
      this.lastTests = lastTests.data;
    })

    this.loadTests();
  }

  loadTests(){
    let params: any = {};
    if(this.selectedChapter){
      params.chapter_id = this.selectedChapter;
    }
    this.service.getTests(params).subscribe(
      (result: any) =>{
        this.tests = result.data;
        if(result.total != this.tests.length){
          this.isLastPage = false;
        }
      }
    )
  }
  
  moreLoad(){
    this.currentPage++;
    let params: any = {
      page: this.currentPage,
    };
    if(this.selectedChapter){
      params.chapter_id = this.selectedChapter;
    }
    this.service.getTests(params).subscribe(
      (result: any) =>{
        this.tests = this.tests.concat(result.data);
        if(result.total == this.tests.length){
          this.isLastPage = true;
        }
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
