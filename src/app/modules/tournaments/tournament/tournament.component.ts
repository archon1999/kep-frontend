import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { TitleService } from 'app/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tournament } from '../tournaments.models';
import { TournamentsService } from '../tournaments.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 1500 }),
    fadeInUpOnEnterAnimation({ duration: 1500 }),
  ]
})
export class TournamentComponent implements OnInit, OnDestroy {

  public tournament: Tournament;

  public currentUser: User;
  public canRegistration = false;

  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthenticationService,
    public service: TournamentsService,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ tournament }) => {
      this.tournament = tournament;
      this.titleService.updateTitle(this.route, { tournamentTitle: this.tournament.title });
      if((new Date(this.tournament.startTime).valueOf() - Date.now()) >= 1000*60*10){
        this.canRegistration = true;
      }
    })    

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    )
  }

  registration(){
    this.service.tournamentRegister(this.tournament.id).subscribe(
      () => {
        window.location.reload();
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
