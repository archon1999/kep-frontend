import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'problem1633',
  templateUrl: './problem1633.component.html',
  styleUrls: ['./problem1633.component.scss']
})
export class Problem1633Component implements OnInit {

  @ViewChild('audio') audio: any;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.audio.nativeElement.play();
    }, 100);
  }

}
