import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'problem1631',
  templateUrl: './problem1631.component.html',
  styleUrls: ['./problem1631.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
})
export class Problem1631Component implements OnInit, OnDestroy {

  @ViewChild('mustbeclicked') btn: any;

  private _intervalId: any;

  constructor() { }

  ngOnInit(): void {
    this._intervalId = setInterval(
      () => {
        const element: HTMLButtonElement = this.btn.nativeElement;
        element.disabled = true;
      }, 100
    );
  }

  onClick() {
    console.log('Clicked! But... to be continued');
    const answer = 'Answer is number of all tags(problemset)';
    if (answer) {}
  }

  ngOnDestroy(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }

}
