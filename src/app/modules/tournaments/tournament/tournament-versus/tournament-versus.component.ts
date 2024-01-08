import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  fadeInDownOnEnterAnimation,
  fadeInLeftOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutDownOnLeaveAnimation,
  fadeOutLeftOnLeaveAnimation,
  fadeOutOnLeaveAnimation,
  fadeOutRightOnLeaveAnimation,
  fadeOutUpOnLeaveAnimation
} from 'angular-animations';
import { UsersApiService } from '@users/users-api.service';
import { Tournament, TournamentStage, TournamentStageDuel } from '../../tournaments.models';

const STAGE_NUMBER = 2;

@Component({
  selector: 'app-tournament-versus',
  templateUrl: './tournament-versus.component.html',
  styleUrls: ['./tournament-versus.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 3000 }),
    fadeOutOnLeaveAnimation({ duration: 3000 }),
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
    fadeInDownOnEnterAnimation({ duration: 3000 }),
    fadeOutLeftOnLeaveAnimation({ duration: 3000 }),
    fadeOutRightOnLeaveAnimation({ duration: 3000 }),
    fadeOutDownOnLeaveAnimation({ duration: 3000 }),
    fadeOutUpOnLeaveAnimation({ duration: 3000 }),
  ]
})
export class TournamentVersusComponent implements OnInit {

  public state = false;
  public tournament: Tournament;

  public duels: Array<TournamentStageDuel> = [];
  public stage: TournamentStage;

  public userFirst;
  public userSecond;

  constructor(
    public usersService: UsersApiService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.state = true, 0);
    setTimeout(() => {
      this.state = false;

      for (let i = 0; i < this.duels.length; i++) {
        setTimeout(() => {
          this.usersService.getUser(this.duels[i].duel.playerFirst.username).subscribe(
            (user) => {
              this.userFirst = user;
            }
          );
          this.usersService.getUser(this.duels[i].duel.playerSecond.username).subscribe(
            (user) => {
              this.userSecond = user;
            }
          );
        }, 10000 * i);
        setTimeout(() => {
          this.userFirst = null;
          this.userSecond = null;
        }, 7000 + 10000 * i);
      }

      setTimeout(() => this.state = true, this.duels.length * 10000 - 2000);
    }, 5000);

    this.route.data.subscribe(({ tournament }) => {
      this.tournament = tournament;
      this.stage = tournament.stages[STAGE_NUMBER];
      this.duels = this.stage.duels;
    });
  }

}
