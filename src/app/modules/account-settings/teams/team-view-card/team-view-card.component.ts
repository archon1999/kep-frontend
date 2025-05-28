import { Component, Input } from '@angular/core';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { Team } from '@users/users.models';

@Component({
  selector: 'team-view-card',
  standalone: true,
  imports: [
    ClipboardModule,
    NgbTooltipModule,
    UserPopoverModule
  ],
  templateUrl: './team-view-card.component.html',
  styleUrl: './team-view-card.component.scss'
})
export class TeamViewCardComponent {
  @Input() team: Team;
}
