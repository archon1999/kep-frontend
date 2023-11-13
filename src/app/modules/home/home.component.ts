import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;

  ngOnInit(): void {
    setTimeout(() => this.audio.nativeElement.play());
  }
}
