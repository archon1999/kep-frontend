import { Component, OnInit } from '@angular/core';
import { BaseLoadComponent } from '@app/common';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { HackathonsApiService } from '@hackathons/data-access/hackathons-api.service';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { Hackathon, HackathonProject } from '@hackathons/domain';
import { forkJoin, interval, Observable } from 'rxjs';
import { HackathonTabComponent } from "@hackathons/ui/components/hackathon-tab/hackathon-tab.component";
import {
  HackathonCountdownComponent
} from "@hackathons/ui/components/hackathon-countdown/hackathon-countdown.component";
import { KepTableComponent } from "@shared/components/kep-table/kep-table.component";
import { KepPaginationComponent } from "@shared/components/kep-pagination/kep-pagination.component";
import { UserPopoverModule } from "@shared/components/user-popover/user-popover.module";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'hackathon-standings',
  templateUrl: './hackathon-standings.page.html',
  styleUrls: ['./hackathon-standings.page.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, KepCardComponent, HackathonTabComponent, HackathonCountdownComponent, KepTableComponent, KepPaginationComponent, UserPopoverModule, NgbTooltip]
})
export class HackathonStandingsPage extends BaseLoadComponent<any> implements OnInit {
  public hackathon: Hackathon;
  public standings: any[] = [];
  public projects: HackathonProject[] = [];

  constructor(private hackathonsApiService: HackathonsApiService) {
    super();
    this.hackathon = this.route.snapshot.data.hackathon;

    interval(30000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => this.loadData()
    )
  }

  getData(): Observable<any> {
    return forkJoin({
      standings: this.hackathonsApiService.getHackathonStandings(this.hackathon.id),
      projects: this.hackathonsApiService.getHackathonProjects(this.hackathon.id),
    });
  }

  afterLoadData({standings, projects}) {
    this.standings = standings as any[];
    this.projects = projects as HackathonProject[];
  }

  getProjectResult(standing: any, symbol: string) {
    const result = standing.projectResults?.find((r: any) => r.symbol === symbol);
    return {
      points: result.points,
      time: result.hackathonTime.slice(0, 5),
    }
  }
}
