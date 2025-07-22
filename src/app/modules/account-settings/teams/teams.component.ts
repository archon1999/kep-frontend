import { Component, inject } from '@angular/core';
import { AccountSettingsService } from '../account-settings.service';
import { BaseLoadComponent } from '@core/common';
import { Observable } from 'rxjs';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TeamComponent } from '@app/modules/account-settings/teams/team-card/team.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { Team } from "@users/domain";

@Component({
  selector: 'teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    SpinnerComponent,
    TeamComponent,
    EmptyResultComponent,
    FormsModule,
    TranslatePipe,
    CoreDirectivesModule
  ]
})
export class TeamsComponent extends BaseLoadComponent<Array<Team>> {
  public teamName = '';
  protected accountSettingsService = inject(AccountSettingsService);

  get teams() {
    return this.data;
  }

  getData(): Observable<Array<Team>> {
    return this.accountSettingsService.getUserTeams();
  }

  createTeam() {
    this.accountSettingsService.createTeam(this.teamName).subscribe(
      () => {
        this.loadData();
      }
    );
  }
}
