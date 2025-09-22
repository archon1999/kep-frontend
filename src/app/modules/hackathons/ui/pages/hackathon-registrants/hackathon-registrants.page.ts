import { Component, inject, OnInit } from '@angular/core';
import { BaseLoadComponent } from '@core/common';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { HackathonsApiService } from '@hackathons/data-access/hackathons-api.service';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { Observable } from "rxjs";
import { Hackathon } from "@hackathons/domain";
import { KepTableComponent } from "@shared/components/kep-table/kep-table.component";
import {
  HackathonCountdownCardComponent
} from "@app/modules/hackathons/ui/components/hackathon-countdown-card/hackathon-countdown-card.component";
import { UserPopoverModule } from "@shared/components/user-popover/user-popover.module";
import { HackathonTabComponent } from "@hackathons/ui/components/hackathon-tab/hackathon-tab.component";

@Component({
  selector: 'hackathon-registrants',
  templateUrl: './hackathon-registrants.page.html',
  styleUrls: ['./hackathon-registrants.page.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, KepCardComponent, KepTableComponent, HackathonCountdownCardComponent, UserPopoverModule, HackathonTabComponent]
})
export class HackathonRegistrantsPage extends BaseLoadComponent<any> implements OnInit {
  public hackathon: Hackathon;

  protected hackathonsApiService = inject(HackathonsApiService);

  constructor() {
    super();

    this.hackathon = this.route.snapshot.data.hackathon;
    this.titleService.updateTitle(this.route, {hackathonTitle: this.hackathon.title});
  }

  getData(): Observable<any> {
    const hackathonId = this.route.snapshot.params['id'];
    return this.hackathonsApiService.getHackathonRegistrants(hackathonId);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Registrants',
      breadcrumb: {
        type: '',
        links: [
          {name: 'Hackathons', isLink: true, link: '../../..'},
          {name: this.hackathon.id + '', isLink: true, link: '..'}
        ]
      }
    };
  }
}
