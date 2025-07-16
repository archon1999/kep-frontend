import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '@app/common';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

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

  constructor(private api: HackathonsApiService) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.hackathonId = p['id'];
      this.api.getHackathonStandings(this.hackathonId).subscribe(s => this.standings = s as any[]);
      this.loadContentHeader();
    });
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
