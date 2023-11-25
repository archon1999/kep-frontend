import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1739',
  templateUrl: './problem1739.component.html',
  styleUrls: ['./problem1739.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1739Component implements OnInit {

  @Input() problem: Problem;

  constructor() {}

  ngOnInit() {}

}
