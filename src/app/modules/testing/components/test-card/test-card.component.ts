import { Component, Input, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({duration: 3000}),
  ]
})
export class TestCardComponent implements OnInit {

  @Input() test: any;

  constructor() { }

  ngOnInit(): void {
  }

}
