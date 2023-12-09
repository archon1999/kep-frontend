import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1740',
  templateUrl: './problem1740.component.html',
  styleUrls: ['./problem1740.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1740Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
