import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1841',
  templateUrl: './problem1841.component.html',
  styleUrls: ['./problem1841.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1841Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
