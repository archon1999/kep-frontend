import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1744',
  templateUrl: './problem1744.component.html',
  styleUrls: ['./problem1744.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1744Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
