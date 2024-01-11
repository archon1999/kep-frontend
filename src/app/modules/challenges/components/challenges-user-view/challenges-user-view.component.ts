import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';

@Component({
  selector: 'challenges-user-view',
  templateUrl: './challenges-user-view.component.html',
  styleUrls: ['./challenges-user-view.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    UserPopoverModule
  ]
})
export class ChallengesUserViewComponent {
  @Input() user: any;
  @Input() withRating = false;
  @Input() light = true;
}
