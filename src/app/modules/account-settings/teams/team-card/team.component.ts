import { Component, inject, Input } from '@angular/core';
import { Team } from '@users/users.models';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { BaseUserComponent } from '@app/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountSettingsService } from '@app/modules/account-settings/account-settings.service';
import { ToastrService } from 'ngx-toastr';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';

@Component({
  selector: 'team-card',
  standalone: true,
  imports: [
    UserPopoverModule,
    CommonModule,
    RouterLink,
    ResourceByIdPipe,
    NgbTooltipModule,
    ClipboardModule,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  animations: [fadeInOnEnterAnimation()]
})
export class TeamComponent extends BaseUserComponent {
  @Input() team: Team;
  protected readonly Resources = Resources;
  private service = inject(AccountSettingsService);
  private toastr = inject(ToastrService);

  refreshCode() {
    this.service.refreshTeamCode(this.team.code).subscribe(
      ({ code }) => {
        this.team.code = code;
        this.toastr.success('Success', '', {
          toastClass: 'toast ngx-toastr',
        });
      }
    );
  }
}
