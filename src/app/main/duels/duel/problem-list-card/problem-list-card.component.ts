import { Component, Input, OnInit } from '@angular/core';
import { DuelProblem } from '../../duels.models';

@Component({
  selector: 'problem-list-card',
  templateUrl: './problem-list-card.component.html',
  styleUrls: ['./problem-list-card.component.scss']
})
export class ProblemListCardComponent implements OnInit {

  @Input() duelProblem: DuelProblem;

  constructor() { }

  ngOnInit(): void {
  }

}
