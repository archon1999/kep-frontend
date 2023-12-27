import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'problem1842',
  templateUrl: './problem1842.component.html',
  styleUrls: ['./problem1842.component.scss'],
  standalone: true,
})
export class Problem1842Component {
  public magicString = 'Answer02102023';
  public magicStringChar = '';

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const index = Math.min(this.magicString.length - 1, Math.max(0, Math.trunc((event.target.innerWidth - 200) / 100)));
    this.magicStringChar = this.magicString[index];
  }

}
