import { Component, inject } from '@angular/core';
import { UserWorkExperience } from '@users/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { PaginatorModule } from 'primeng/paginator';
import { BaseLoadComponent } from '@core/common';
import { AccountSettingsService } from '@app/modules/account-settings/account-settings.service';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@shared/directives/directives.module';

@Component({
  selector: 'work-experiences',
  imports: [
    KepCardComponent,
    PaginatorModule,
    SpinnerComponent,
    TranslatePipe,
    CoreDirectivesModule
  ],
  templateUrl: './work-experiences.component.html',
  styleUrl: './work-experiences.component.scss',
  standalone: true,
})
export class WorkExperiencesComponent extends BaseLoadComponent<UserWorkExperience[]> {
  public userWorkExperiences: Array<UserWorkExperience>;
  public errors: any;

  protected accountSettingsService = inject(AccountSettingsService);

  getData(): Observable<UserWorkExperience[]> {
    return this.accountSettingsService.getUserWorkExperiences();
  }

  afterLoadData(data: UserWorkExperience[]) {
    this.userWorkExperiences = data;
  }

  addWorkExperience() {
    this.userWorkExperiences.push({
      company: '',
      jobTitle: '',
      fromYear: null,
      toYear: null,
    });
  }

  deleteWorkExperience(index: number) {
    this.userWorkExperiences.splice(index, 1);
  }

  save() {
    this.accountSettingsService.updateUserWorkExperiences(this.userWorkExperiences).subscribe(
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
