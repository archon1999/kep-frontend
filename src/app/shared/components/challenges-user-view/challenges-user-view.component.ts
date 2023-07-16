import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'challenges-user-view',
  templateUrl: './challenges-user-view.component.html',
  styleUrls: ['./challenges-user-view.component.scss']
})
export class ChallengesUserViewComponent implements OnInit {

  @Input() user: any;
  @Input() withRating = false;

  constructor() { }

  ngOnInit(): void {
  }

}
