import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenges.models';

@Component({
  selector: 'challenge-results-card',
  templateUrl: './challenge-results-card.component.html',
  styleUrls: ['./challenge-results-card.component.scss']
})
export class ChallengeResultsCardComponent implements OnInit {

  @Input() challenge: Challenge;

  constructor() { }

  ngOnInit(): void {
  }

}
