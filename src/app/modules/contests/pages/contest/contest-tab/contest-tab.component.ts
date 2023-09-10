import { Component, Input, OnInit } from '@angular/core';
import { Contest } from '../../../contests.models';

@Component({
  selector: 'contest-tab',
  templateUrl: './contest-tab.component.html',
  styleUrls: ['./contest-tab.component.scss', '../../../contests.colors.scss']
})
export class ContestTabComponent implements OnInit {

  public activeId = 1;

  @Input() contest: Contest;

  constructor() { }

  ngOnInit(): void {
  }

}
