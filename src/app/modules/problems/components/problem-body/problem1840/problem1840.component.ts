import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1840',
  templateUrl: './problem1840.component.html',
  styleUrls: ['./problem1840.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1840Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
