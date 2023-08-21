import { Component, Input, OnInit } from '@angular/core';
import { CodeRush } from '../../code-rush.models';

@Component({
  selector: 'code-rush-countdown',
  templateUrl: './coder-rush-countdown.component.html',
  styleUrls: ['./coder-rush-countdown.component.scss']
})
export class CoderRushCountdownComponent implements OnInit {

  @Input() codeRush: CodeRush;

  public leftTime = 0;

  constructor() { }

  ngOnInit(): void {
  }

  finish(){
  }

}
