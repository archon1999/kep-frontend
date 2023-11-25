import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'challenges-rank-badge',
  templateUrl: './challenges-rank-badge.component.html',
  styleUrls: ['./challenges-rank-badge.component.scss']
})
export class ChallengesRankBadgeComponent implements OnInit {

  @Input() title: string;
  @Input() rating?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
