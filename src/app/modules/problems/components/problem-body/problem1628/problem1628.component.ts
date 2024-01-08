import { Component, OnInit } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'problem1628',
  templateUrl: './problem1628.component.html',
  styleUrls: ['./problem1628.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
})
export class Problem1628Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Answer is 1628');
    console.warn('WARNING! Problem #3 eto swap');
  }

}
