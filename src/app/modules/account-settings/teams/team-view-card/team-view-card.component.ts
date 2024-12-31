import { Component, Input } from '@angular/core';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { NgIf } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { Team } from '@users/users.models';

@Component({
  selector: 'team-view-card',
  standalone: true,
  imports: [
    ClipboardModule,
    NgIf,
    NgbTooltipModule,
    ResourceByIdPipe,
    UserPopoverModule
  ],
  templateUrl: './team-view-card.component.html',
  styleUrl: './team-view-card.component.scss'
})
export class TeamViewCardComponent {
  @Input() team: Team;
}
