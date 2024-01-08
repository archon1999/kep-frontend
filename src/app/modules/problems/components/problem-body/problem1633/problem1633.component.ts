import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'problem1633',
  templateUrl: './problem1633.component.html',
  styleUrls: ['./problem1633.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
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
