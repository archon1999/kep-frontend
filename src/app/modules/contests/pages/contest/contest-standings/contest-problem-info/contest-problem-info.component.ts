import { Component, Input, OnInit } from '@angular/core';
import { ContestTypes } from '../../../../../contests/contests.models';
import { ContestProblemInfo } from '@contests/models/contest-problem-info';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'contest-problem-info',
  templateUrl: './contest-problem-info.component.html',
  styleUrls: ['./contest-problem-info.component.scss']
})
export class ContestProblemInfoComponent implements OnInit {

  @Input() problemInfo: ContestProblemInfo;
  @Input() contest: Contest;

  public ContestTypes = ContestTypes;

  constructor() { }

  ngOnInit(): void {
  }

}
