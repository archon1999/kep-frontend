import { Component, inject, Input } from '@angular/core';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { CommonModule } from '@angular/common';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { BaseUserComponent } from '@core/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountSettingsService } from '@app/modules/account-settings/account-settings.service';
import { ToastrService } from 'ngx-toastr';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Team } from "@users/domain";

@Component({
  selector: 'team-card',
  standalone: true,
  imports: [
    UserPopoverModule,
    CommonModule,
    ResourceByIdPipe,
    NgbTooltipModule,
    ClipboardModule,
    KepCardComponent,
    TranslatePipe,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent extends BaseUserComponent {
  @Input() team: Team;

  protected readonly Resources = Resources;
  protected accountSettingsService = inject(AccountSettingsService);
  protected toastr = inject(ToastrService);
  protected translateService = inject(TranslateService);

  refreshCode() {
    this.accountSettingsService.refreshTeamCode(this.team.code).subscribe(
      ({ code }) => {
        this.team.code = code;
        this.toastr.success(this.translateService.instant('Settings.Saved'));
      }
    );
  }
}
