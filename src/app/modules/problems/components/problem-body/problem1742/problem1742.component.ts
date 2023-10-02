import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1742',
  templateUrl: './problem1742.component.html',
  styleUrls: ['./problem1742.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1742Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
