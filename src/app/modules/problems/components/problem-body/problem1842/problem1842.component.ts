import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'problem1842',
  templateUrl: './problem1842.component.html',
  styleUrls: ['./problem1842.component.scss']
})
export class Problem1842Component implements OnInit {
  public magicString = 'Answer02102023';
  public magicStringChar = '';

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const index = Math.min(this.magicString.length - 1, Math.max(0, Math.trunc((event.target.innerWidth - 200) / 100)));
    this.magicStringChar = this.magicString[index];
  }

}
