import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1743',
  templateUrl: './problem1743.component.html',
  styleUrls: ['./problem1743.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1743Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
