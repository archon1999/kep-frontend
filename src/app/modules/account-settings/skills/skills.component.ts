import { Component, inject } from '@angular/core';
import { UserSkills } from '@users/users.models';
import { AccountSettingsService } from '../account-settings.service';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TechnologiesComponent } from '@app/modules/account-settings/skills/technologies/technologies.component';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    KepCardComponent,
    SpinnerComponent,
    CoreDirectivesModule,
    NgxSliderModule,
    TechnologiesComponent
  ]
})
export class SkillsComponent extends BaseLoadComponent<UserSkills> {
  public userSkills: UserSkills;
  public sliderOptions = {
    ceil: 100,
    showSelectionBar: true,
  }
  protected accountSettingsService = inject(AccountSettingsService);

  getData(): Observable<UserSkills> {
    return this.accountSettingsService.getUserSkills();
  }

  afterLoadData(data: UserSkills) {
    this.userSkills = data;
  }

  save() {
    this.accountSettingsService.updateUserSkills(this.userSkills).subscribe(
      {
        next: () => {
          this.toastr.success(this.translateService.instant('Settings.Saved'));
        }, error: (err) => {
          this.toastr.error(this.translateService.instant('Settings.Error'));
        }
      }
    );
  }

  reset() {
    this.loadData();
  }
}
