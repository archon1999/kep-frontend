import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../../users/users.models';
import { AccountSettingsService } from '../account-settings.service';

@Component({
  selector: 'teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  public teams: Array<Team> = [];

  constructor(
    public service: AccountSettingsService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ userTeams }) => {
      this.teams = userTeams;
    })
  }

  leaveTeam(teamIndex: number){

  }

  kickMember(teamIndex: number, memberUsername: string){

  }

  createTeam(teamName: string){

  }

}
