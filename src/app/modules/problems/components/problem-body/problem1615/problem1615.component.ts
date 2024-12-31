import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'problem1615',
  templateUrl: './problem1615.component.html',
  styleUrls: ['./problem1615.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
})
export class Problem1615Component implements OnInit, OnDestroy {

  @ViewChild('mustbeclicked') btn: any;

  private _intervalId: any;

  constructor() { }

  ngOnInit(): void {
    this._intervalId = setInterval(
      () => {
        let element: HTMLButtonElement = this.btn.nativeElement;
        element.disabled = true;
      }, 100
    )
  }

  onClick() {
    console.log('1952');
  }

  ngOnDestroy(): void {
    if(this._intervalId){
      clearInterval(this._intervalId);
    }
  }

}
