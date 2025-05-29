import { Component, inject } from '@angular/core';
import { AccountSettingsService } from '../account-settings.service';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { UserSocial } from "@users/domain";

@Component({
  selector: 'social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    SpinnerComponent,
    TranslatePipe,
    FormsModule,
    CoreDirectivesModule
  ]
})
export class SocialComponent extends BaseLoadComponent<UserSocial> {
  public userSocial: UserSocial;

  public errors: any;

  protected accountSettingsService = inject(AccountSettingsService);

  getData(): Observable<UserSocial> {
    return this.accountSettingsService.getUserSocial();
  }

  afterLoadData(data: UserSocial) {
    this.userSocial = data;
  }

  save() {
    this.accountSettingsService.updateUserSocial(this.userSocial).subscribe(
      {
        next: () => {
          this.toastr.success(this.translateService.instant('Settings.Saved'));
          this.errors = null;
          this.authService.getMe().subscribe();
        }, error: (err) => {
          this.errors = err.error;
          this.toastr.error(this.translateService.instant('Settings.Error'));
        }
      }
    );
  }

  reset() {
    this.loadData();
  }
}
