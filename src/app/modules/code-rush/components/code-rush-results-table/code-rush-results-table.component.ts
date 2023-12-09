import { Component, Input, OnInit } from '@angular/core';
import { CodeRush } from '../../code-rush.models';

@Component({
  selector: 'code-rush-results-table',
  templateUrl: './code-rush-results-table.component.html',
  styleUrls: ['./code-rush-results-table.component.scss']
})
export class CodeRushResultsTableComponent implements OnInit {

  @Input() codeRush: CodeRush;

  constructor() { }

  ngOnInit(): void {
  }

}
