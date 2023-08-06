import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenges.models';

@Component({
  selector: 'challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss']
})
export class ChallengeCardComponent implements OnInit {

  @Input() challenge: Challenge;

  constructor() { }

  ngOnInit(): void {
  }

}
