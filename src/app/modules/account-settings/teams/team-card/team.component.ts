import { Component, Input } from '@angular/core';
import { Team } from '@users/users.models';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'team-card',
  standalone: true,
  imports: [
    UserPopoverModule,
    CommonModule,
    RouterLink,
    ResourceByIdPipe,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  @Input() team: Team;
  protected readonly Resources = Resources;
}
