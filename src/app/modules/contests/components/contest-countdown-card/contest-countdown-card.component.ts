import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Contest, ContestStatus } from '@contests/contests.models';

@Component({
  selector: 'contest-card-countdown',
  templateUrl: './contest-countdown-card.component.html',
  styleUrls: ['./contest-countdown-card.component.scss']
})
export class ContestCountdownCardComponent {
  @Input() contest: Contest;

  @ViewChild('contestLogo') contestLogoRef: ElementRef<HTMLImageElement>;

  public logoWidth: number;
  public logoHeight: number;

  protected readonly ContestStatus = ContestStatus;

  onLoad(event: any) {
    this.logoHeight = this.contestLogoRef.nativeElement.naturalHeight;
    this.logoWidth = this.contestLogoRef.nativeElement.naturalWidth;
  }
}
