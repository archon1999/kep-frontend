import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'new-challenge-button',
  templateUrl: './new-challenge-button.component.html',
  styleUrls: ['./new-challenge-button.component.scss']
})
export class NewChallengeButtonComponent implements OnInit {

  @Input() timeSeconds: number;
  @Input() questionsCount: number;

  constructor() { }

  ngOnInit(): void {
  }

}
