import { Component, Input, OnInit } from '@angular/core';
import { CodeRush, CodeRushStatus } from '../../code-rush.models';

@Component({
  selector: 'code-rush-countdown',
  templateUrl: './code-rush-countdown.component.html',
  styleUrls: ['./code-rush-countdown.component.scss']
})
export class CodeRushCountdownComponent implements OnInit {

  @Input() codeRush: CodeRush;

  public leftTime = 0;

  constructor() { }

  ngOnInit(): void {
    if (this.codeRush.status == CodeRushStatus.NOT_STARTED) {
      this.leftTime = new Date(this.codeRush.startTime).valueOf() - Date.now();
    } else if (this.codeRush.status == CodeRushStatus.ALREADY) {
      this.leftTime = new Date(this.codeRush.finishTime).valueOf() - Date.now();
    }
  }

  finish() {
  }

}
