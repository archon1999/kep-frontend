import { Component, inject } from '@angular/core';
import { UserGeneralInfo } from '@users/domain';
import { AccountSettingsService } from '../account-settings.service';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { FormsModule } from '@angular/forms';
import { KepcoinSpendSwalModule } from '@app/modules/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    FormsModule,
    KepcoinSpendSwalModule,
    CoreDirectivesModule,
    SpinnerComponent,
    TranslatePipe
  ]
})
export class GeneralSettingsComponent extends BaseLoadComponent<UserGeneralInfo> {

  public generalInfo: UserGeneralInfo;
  public generalSettings: UserGeneralInfo;

  public canChangeCoverPhoto = false;
  public errors: any;

  protected accountSettingsService = inject(AccountSettingsService);

  getData(): Observable<UserGeneralInfo> {
    return this.accountSettingsService.getUserGeneralInfo();
  }

  afterLoadData(generalInfo: UserGeneralInfo) {
    this.generalInfo = generalInfo;
    this.generalSettings = {
      username: generalInfo.username,
      firstName: generalInfo.firstName,
      lastName: generalInfo.lastName,
      email: generalInfo.email,
    };
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.generalInfo.avatar = event.target.result;
        this.generalSettings.avatar = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadCover(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.generalInfo.coverPhoto = event.target.result;
        this.generalSettings.coverPhoto = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  save() {
    this.accountSettingsService.updateUserGeneralInfo(this.generalSettings).subscribe(
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
    )
  }

  reset() {
    this.loadData();
  }
}
