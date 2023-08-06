import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'problem1615',
  templateUrl: './problem1615.component.html',
  styleUrls: ['./problem1615.component.scss']
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