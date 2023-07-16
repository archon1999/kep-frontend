import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'problem1623',
  templateUrl: './problem1623.component.html',
  styleUrls: ['./problem1623.component.scss']
})
export class Problem1623Component implements OnInit {

  @ViewChild('audio') audio: any;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.audio.nativeElement.play();
    }, 2000);
  }

}
