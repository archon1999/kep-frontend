import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { TestingService } from '../testing.service';

@Component({
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [
    fadeInOnEnterAnimation({  duration: 3000 }),
  ]
})
export class TestComponent implements OnInit, OnDestroy {

  public test: any;
  public bestResults: Array<any> = [];
  public lastResults: Array<any> = [];

  public canStart = false;

  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: TestingService,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe(({ test }) => {
        this.test = test;
        this.titleService.updateTitle(this.route, { testTitle: test.title });
      })
    
    this.service.getTestBestResults(this.test.id)
      .subscribe((result: any) => {
        this.bestResults = result;
      })

    this.service.getTestLastResults(this.test.id)
      .subscribe((result: any) => {
        this.lastResults = result;
      })
  }

  testStart(){
    this.service.testStart(this.test.id).subscribe((result: any) => {
      if(result.success){
        this.router.navigate(['/practice', 'tests', 'test-pass', result.testPassId]);
      }
    })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
