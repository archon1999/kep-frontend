import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContestStatus } from '@contests/constants/contest-status';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'contest-card-countdown',
  templateUrl: './contest-countdown-card.component.html',
  styleUrls: ['./contest-countdown-card.component.scss'],
  standalone: false,
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
