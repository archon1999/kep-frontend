import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '@app/common';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { HackathonProject } from '@app/modules/hackathons/domain';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'hackathon-standings',
  templateUrl: './hackathon-standings.component.html',
  styleUrls: ['./hackathon-standings.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, KepCardComponent]
})
export class HackathonStandingsComponent extends BasePageComponent implements OnInit {
  public hackathonId: number;
  public standings: any[] = [];
  public projects: HackathonProject[] = [];

  constructor(private api: HackathonsApiService) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hackathonId = params['id'];
      forkJoin({
        standings: this.api.getHackathonStandings(this.hackathonId),
        projects: this.api.getHackathonProjects(this.hackathonId)
      }).subscribe(({ standings, projects }) => {
        this.standings = standings as any[];
        this.projects = projects as HackathonProject[];
      });
      this.loadContentHeader();
    });
  }

  getProjectResult(standing: any, symbol: string): string {
    const result = standing.projectResults?.find((r: any) => r.symbol === symbol);
    return result ? `${result.points} (${result.hackathonTime})` : '';
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Standings',
      breadcrumb: {
        type: '',
        links: [
          { name: 'Hackathons', isLink: true, link: '../../..' },
          { name: this.hackathonId + '', isLink: true, link: '..' }
        ]
      }
    };
  }
}
