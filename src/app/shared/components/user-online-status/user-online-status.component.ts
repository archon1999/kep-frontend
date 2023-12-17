import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'user-online-status',
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule
  ],
  templateUrl: './user-online-status.component.html',
  styleUrl: './user-online-status.component.scss'
})
export class UserOnlineStatusComponent {
  @Input() online: boolean;
  @Input() lastSeen: string;
}
