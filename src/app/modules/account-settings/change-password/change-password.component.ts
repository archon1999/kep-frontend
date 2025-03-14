import { Component, inject } from '@angular/core';
import { AccountSettingsService } from '../account-settings.service';
import { BaseComponent } from '@app/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { CoreDirectivesModule } from '@shared/directives/directives.module';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    KepCardComponent,
    TranslatePipe,
    KepIconComponent,
    CoreDirectivesModule
  ]
})
export class ChangePasswordComponent extends BaseComponent {

  public passwordOldType = false;
  public passwordOld = '';

  public passwordNewType = false;
  public passwordNew = '';

  public passwordConfirmType = false;
  public passwordConfirm = '';

  protected accountSettingsService = inject(AccountSettingsService);

  change() {
    if (this.passwordNew != this.passwordConfirm) {
      this.toastr.error(this.translateService.instant('Settings.ConfirmNewPasswordIncorrect'));
    } else {
      this.accountSettingsService.changePassword(this.passwordOld, this.passwordNew).subscribe(
        {
          next: () => {
            this.toastr.success(this.translateService.instant('Settings.Saved'));
          },
          error: () => {
            this.toastr.error(this.translateService.instant('Settings.WrongPassword'));
          }
        }
      );
    }
  }

}
