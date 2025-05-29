import { Component, inject, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { filter, map, Observable } from 'rxjs';
import { BaseLoadComponent } from "@app/common";
import { TournamentsApiService } from "@app/modules/tournaments/data-access/tournaments-api.service";
import { Tournament } from "@tournaments/domain";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { LocalizedDatePipe } from "@shared/pipes/localized-date.pipe";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet } from "@ng-bootstrap/ng-bootstrap";
import { TournamentScheduleComponent } from "./tournament-schedule/tournament-schedule.component";
import { TournamentDuelsComponent } from "@tournaments/ui/pages/tournament/tournament-duels/tournament-duels.component";
import { TournamentInfoComponent } from "@tournaments/ui/pages/tournament/tournament-info/tournament-info.component";
import { TournamentBracketComponent } from "./tournament-bracket/tournament-bracket.component";
import { SpinnerComponent } from "@shared/components/spinner/spinner.component";
import { NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.page.html',
  animations: [
    fadeInLeftOnEnterAnimation({translate: '40px'}),
    fadeInUpOnEnterAnimation({translate: '40px'}),
  ],
  standalone: true,
  imports: [
    KepCardComponent,
    LocalizedDatePipe,
    TranslatePipe,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    TournamentScheduleComponent,
    TournamentDuelsComponent,
    TournamentInfoComponent,
    TournamentBracketComponent,
    SpinnerComponent
  ],
})
export class TournamentPage extends BaseLoadComponent<Tournament> implements OnInit {
  public activeId = 0;
  public tournamentTabKeyName: string;
  public canRegistration = false;

  protected tournamentsApiService = inject(TournamentsApiService);

  get tournament() {
    return this.data;
  }

  override ngOnInit() {
    super.ngOnInit();

    this.activeId = this.fragmentToId[this.route.snapshot.fragment ?? ''] ?? 1;

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => this.route.snapshot.fragment),
      )
      .subscribe(f => {
        const id = this.fragmentToId[f ?? ''];
        console.log(id);
        if (id && id !== this.activeId) this.activeId = id;
      });
  }

  getData(): Observable<Tournament> {
    const tournamentId = this.route.snapshot.params['id'];
    return this.tournamentsApiService.getTournament(tournamentId);
  }

  afterLoadData(tournament: Tournament) {
    this.tournamentTabKeyName = `tournament-${tournament.id}-tab`;
    this.activeId = this.sessionStorageService.get(this.tournamentTabKeyName) || 1;
    this.titleService.updateTitle(this.route, {tournamentTitle: tournament.title});
    if ((new Date(tournament.startTime).valueOf() - Date.now()) >= 1000 * 60 * 10) {
      this.canRegistration = true;
    }
  }

  tabChange(event) {
    const fragment = this.idToFragment[event.nextId] ?? `tab-${event.nextId}`;
    this.router.navigate([], {
      relativeTo: this.route,
      fragment,
      queryParamsHandling: 'preserve',
      // replaceUrl: true,               // если не хотим множить history-записи
    });
  }

  registration() {
    this.tournamentsApiService.tournamentRegister(this.tournament.id).subscribe(
      () => {
        window.location.reload();
      }
    );
  }

  private readonly idToFragment: Record<number, string> = {
    1: 'info',
    2: 'duels',
    3: 'results',
    4: 'schedule',
  };
  private readonly fragmentToId: Record<string, number> = Object.fromEntries(
    Object.entries(this.idToFragment).map(([k, v]) => [v, +k]),
  );
}

