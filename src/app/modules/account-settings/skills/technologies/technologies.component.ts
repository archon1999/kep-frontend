import { Component, inject } from '@angular/core';
import { UserTechnology } from '@users/users.models';
import { devIcons } from './dev-icons';
import { repeaterAnimation } from '@app/modules/account-settings/skills/technologies/repeater-animation';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseLoadComponent } from '@app/common';
import { AccountSettingsService } from '@app/modules/account-settings/account-settings.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { ColorPickerModule } from 'ngx-color-picker';
import { CoreDirectivesModule } from '@shared/directives/directives.module';

@Component({
  selector: 'technologies',
  imports: [
    KepCardComponent,
    SpinnerComponent,
    TranslatePipe,
    FormsModule,
    NgSelectComponent,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    ColorPickerModule,
    CoreDirectivesModule
  ],
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss',
  animations: [repeaterAnimation],
  standalone: true,
})
export class TechnologiesComponent extends BaseLoadComponent<UserTechnology[]> {
  public userTechnologies: Array<UserTechnology>;
  public devIcons = devIcons;

  protected accountSettingsService = inject(AccountSettingsService);

  getData(): Observable<UserTechnology[]> {
    return this.accountSettingsService.getUserTechnologies();
  }

  afterLoadData(data: UserTechnology[]) {
    this.userTechnologies = data;
  }

  addTechnology() {
    this.userTechnologies.push({
      text: '',
      devIconClass: '',
      badgeColor: '',
    });
  }

  deleteTechnology(index: number) {
    this.userTechnologies.splice(index, 1);
  }

  save() {
    this.accountSettingsService.updateUserTechnologies(this.userTechnologies).subscribe(
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
