import { Component, inject } from '@angular/core';
import { UserEducation } from '@users/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { PaginatorModule } from 'primeng/paginator';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { AccountSettingsService } from '@app/modules/account-settings/account-settings.service';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { repeaterAnimation } from '@app/modules/account-settings/skills/technologies/repeater-animation';

@Component({
  selector: 'educations',
  imports: [
    KepCardComponent,
    PaginatorModule,
    SpinnerComponent,
    TranslatePipe,
    CoreDirectivesModule
  ],
  templateUrl: './educations.component.html',
  styleUrl: './educations.component.scss',
  standalone: true,
})
export class EducationsComponent extends BaseLoadComponent<UserEducation[]> {
  public userEducations: Array<UserEducation>;
  public errors: any;

  protected accountSettingsService = inject(AccountSettingsService);

  getData(): Observable<UserEducation[]> {
    return this.accountSettingsService.getUserEducations();
  }

  afterLoadData(data: UserEducation[]) {
    this.userEducations = data;
  }

  addEducation() {
    this.userEducations.push({
      organization: '',
      degree: '',
      fromYear: null,
      toYear: null,
    });
  }

  deleteEducation(index: number) {
    this.userEducations.splice(index, 1);
  }

  save() {
    this.accountSettingsService.updateUserEducations(this.userEducations).subscribe(
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
}
