import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kep-badge',
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
  ],
  templateUrl: './kep-badge.component.html',
  styleUrl: './kep-badge.component.scss'
})
export class KepBadgeComponent {
  @Input() streak: number;
}
