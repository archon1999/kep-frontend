import { Component, OnInit, inject } from '@angular/core';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { Hackathon } from '@app/modules/hackathons/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { HackathonTabComponent } from './hackathon-tab/hackathon-tab.component';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';

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
  ]
})
export class HackathonPage extends BaseLoadComponent<Hackathon> implements OnInit {
  protected api = inject(HackathonsApiService);

  ngOnInit(): void {
    super.ngOnInit();
  }

  getData(): Observable<Hackathon> {
    const id = this.route.snapshot.params['id'];
    return this.api.getHackathon(id);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: this.data?.name,
      breadcrumb: {
        links: [
          { name: 'Hackathons', isLink: true, link: '../..' },
          { name: this.data?.id + '', isLink: false }
        ]
      }
    };
  }
}
