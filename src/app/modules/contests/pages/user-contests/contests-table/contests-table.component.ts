import { Component, Input, OnInit } from '@angular/core';
import { Contest } from '../user-contests.models';

@Component({
  selector: 'contests-table',
  templateUrl: './contests-table.component.html',
  styleUrls: ['./contests-table.component.scss']
})
export class ContestsTableComponent implements OnInit {

  @Input() contests: Array<Contest> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
