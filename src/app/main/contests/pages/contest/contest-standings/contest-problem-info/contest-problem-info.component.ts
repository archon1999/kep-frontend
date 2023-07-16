import { Component, Input, OnInit } from '@angular/core';
import { Contest, ContestProblemInfo, ContestTypes } from 'app/main/contests/contests.models';

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
