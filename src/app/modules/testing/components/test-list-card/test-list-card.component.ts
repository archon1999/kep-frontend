import { Component, Input, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Test } from '../../testing.models';

@Component({
  selector: 'test-list-card',
  templateUrl: './test-list-card.component.html',
  styleUrls: ['./test-list-card.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 3000 }),
  ]
})
export class TestListCardComponent implements OnInit {

  @Input() test: Test;

  constructor() { }

  ngOnInit(): void {
  }

}
