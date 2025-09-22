import { Component, inject, OnInit } from '@angular/core';
import { BaseLoadComponent, BasePageComponent } from '@core/common';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { Hackathon } from '@app/modules/hackathons/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { HackathonTabComponent } from '@hackathons/ui/components/hackathon-tab/hackathon-tab.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { HackathonCardComponent } from "@app/modules/hackathons";
import { HackathonTableComponent } from "@hackathons/ui/components/hackathon-table/hackathon-table.component";

@Component({
  selector: 'page-hackathon',
  templateUrl: './hackathon.page.html',
  styleUrls: ['./hackathon.page.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    KepCardComponent,
    HackathonTabComponent,
    ContentHeaderModule,
    HackathonCardComponent,
    HackathonTableComponent,
  ]
})
export class HackathonPage extends BasePageComponent implements OnInit {
  public hackathon: Hackathon;

  protected hackathonsApiService = inject(HackathonsApiService);

  constructor() {
    super();
    this.hackathon = this.route.snapshot.data.hackathon;
    this.titleService.updateTitle(this.route, {hackathonTitle: this.hackathon.title});
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: this.hackathon.title,
      breadcrumb: {
        links: [
          {name: 'Hackathons', isLink: true, link: '../..'},
          {name: this.hackathon.id + '', isLink: false}
        ]
      }
    };
  }
}
