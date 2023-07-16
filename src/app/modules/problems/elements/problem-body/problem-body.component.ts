import { Component, Input, OnInit } from '@angular/core';
import { Problem } from '../../problems.models';

@Component({
  selector: 'problem-body',
  templateUrl: './problem-body.component.html',
  styleUrls: ['./problem-body.component.scss']
})
export class ProblemBodyComponent implements OnInit {

  @Input() problem: Problem;

  constructor() { }

  ngOnInit(): void {
  }

}
