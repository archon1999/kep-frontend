import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContestStatus } from '@contests/constants/contest-status';
import { Hackathon } from "@hackathons/domain";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { HackathonCountdownComponent } from "../hackathon-countdown/hackathon-countdown.component";
import { LocalizedDatePipe } from "@shared/pipes/localized-date.pipe";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'hackathon-card-countdown',
  templateUrl: './hackathon-countdown-card.component.html',
  styleUrls: ['./hackathon-countdown-card.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    HackathonCountdownComponent,
    LocalizedDatePipe,
    TranslatePipe
  ]
})
export class HackathonCountdownCardComponent {
  @Input() hackathon: Hackathon;

  @ViewChild('contestLogo') contestLogoRef: ElementRef<HTMLImageElement>;

  public logoWidth: number;
  public logoHeight: number;

  protected readonly ContestStatus = ContestStatus;

  onLoad(event: any) {
    this.logoHeight = this.contestLogoRef.nativeElement.naturalHeight;
    this.logoWidth = this.contestLogoRef.nativeElement.naturalWidth;
  }
}
