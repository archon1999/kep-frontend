import { Component } from '@angular/core';
import { Team } from '@users/users.models';
import { AccountSettingsService } from '../account-settings.service';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent extends BaseLoadComponent<Array<Team>> {
  public teamName = '';

  constructor(
    public service: AccountSettingsService,
  ) {
    super();
  }

  get teams() {
    return this.data;
  }

  getData(): Observable<Array<Team>> {
    return this.service.getUserTeams();
  }

  createTeam() {
    this.service.createTeam(this.teamName).subscribe(
      () => {
        this.loadData();
      }
    );
  }
}
