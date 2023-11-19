import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SoundsService } from '@shared/services/sounds/sounds.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;

  public homeSoundSrc: string;

  constructor(public soundService: SoundsService) {}

  ngOnInit(): void {
    this.homeSoundSrc = this.soundService.getHomeSoundSrc();
    setTimeout(() => this.audio.nativeElement.play());
  }
}
