import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1741',
  templateUrl: './problem1741.component.html',
  styleUrls: ['./problem1741.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1741Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
