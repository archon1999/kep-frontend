import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tournament } from '../tournaments.models';
import { TournamentsService } from '../tournaments.service';
import { SessionStorageService } from 'app/shared/storages/session-storage.service';

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

  public activeId = 0;
  public tournamentTabKeyName: string;

  public currentUser: User | null;
  public canRegistration = false;

  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthenticationService,
    public service: TournamentsService,
    public titleService: TitleService,
    public sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ tournament }) => {
      this.tournament = tournament;
      this.tournamentTabKeyName = `tournament-${this.tournament.id}-tab`;
      this.activeId = this.sessionStorageService.get(this.tournamentTabKeyName) || 1;
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

  tabChange(event){
    this.sessionStorageService.set(this.tournamentTabKeyName, event.nextId);
  }

  registration(){
    this.service.tournamentRegister(this.tournament.id).subscribe(
      () => {
        window.location.reload();
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
