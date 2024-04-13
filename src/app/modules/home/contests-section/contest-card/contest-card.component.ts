import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Contest } from '@contests/models';
import { RouterLink } from '@angular/router';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { Resources } from '@app/resources';
import { ContestStatus } from '@contests/constants';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'contest-card',
  standalone: true,
  imports: [
    RouterLink,
    ResourceByIdPipe,
    ContestClassesPipe,
    KepIconComponent,
    CoreCommonModule
  ],
  templateUrl: './contest-card.component.html',
  styleUrl: './contest-card.component.scss'
})
export class ContestCardComponent {
  @Input() contest: Contest;
  @ViewChild('contestLogo') contestLogoRef: ElementRef<HTMLImageElement>;

  public logoWidth: number;
  public logoHeight: number;

  protected readonly ResourceByIdPipe = ResourceByIdPipe;
  protected readonly Resources = Resources;
  protected readonly ContestStatus = ContestStatus;

  onLoad(event: any) {
    this.logoHeight = this.contestLogoRef.nativeElement.naturalHeight;
    this.logoWidth = this.contestLogoRef.nativeElement.naturalWidth;
  }
}
