import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'problem1737',
  templateUrl: './problem1737.component.html',
  styleUrls: ['./problem1737.component.scss']
})
export class Problem1737Component implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    console.log('Answer: 9731456');
  }

  ngOnDestroy(): void {
  }

}
