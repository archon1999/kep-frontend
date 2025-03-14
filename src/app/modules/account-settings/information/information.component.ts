import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UserInfo } from '@users/users.models';
import { AccountSettingsService } from '../account-settings.service';
import { NgxCountriesService } from '@shared/third-part-modules/ngx-countries/ngx-countries.service';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { FlatPickrOutputOptions } from 'angularx-flatpickr/lib/flatpickr.directive';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    SpinnerComponent,
    TranslatePipe,
    KepCardComponent,
    FormsModule,
    NgSelectComponent,
    NgOptionComponent,
    CoreDirectivesModule,
    FlatpickrDirective
  ]
})
export class InformationComponent extends BaseLoadComponent<UserInfo> implements OnInit {
  public userInfo: UserInfo;
  public errors: any;
  public birthDate: Date;
  public countries = [];

  protected accountSettingsService = inject(AccountSettingsService);
  protected countriesService = inject(NgxCountriesService);

  constructor() {
    super();
    this.initCountries();
  }

  getData(): Observable<UserInfo> {
    return this.accountSettingsService.getUserInfo();
  }

  afterLoadData(data: UserInfo) {
    this.userInfo = data;
    this.birthDate = new Date(data.dateOfBirth);
  }

  onDateChange(event: FlatPickrOutputOptions) {
    this.userInfo.dateOfBirth = event.dateString;
  }

  save() {
    this.accountSettingsService.updateUserInfo(this.userInfo).subscribe(
      {
        next: () => {
          this.toastr.success(this.translateService.instant('Settings.Saved'));
          this.errors = null;
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

  initCountries() {
    const countries = this.countriesService.getNames();
    for (const country of Object.keys(countries)) {
      this.countries.push({
        id: country,
        name: countries[country],
      });
    }
    this.countries = this.countries.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name === b.name) {
        return 0;
      } else {
        return 1;
      }
    });
  }
}
