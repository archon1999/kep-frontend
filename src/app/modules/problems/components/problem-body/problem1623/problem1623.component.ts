import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'problem1623',
  templateUrl: './problem1623.component.html',
  styleUrls: ['./problem1623.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
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
