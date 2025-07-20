import { Component, OnInit } from '@angular/core';
import { HackathonsApiService } from '@hackathons/data-access/hackathons-api.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ProjectCardComponent } from '@projects/ui/components/project-card/project-card.component';
import { Hackathon, HackathonProject } from '@hackathons/domain';
import { BaseLoadComponent } from '@app/common';
import { Observable } from "rxjs";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { HackathonTabComponent } from "@hackathons/ui/components/hackathon-tab/hackathon-tab.component";

@Component({
  selector: 'hackathon-projects',
  templateUrl: './hackathon-projects.page.html',
  styleUrls: ['./hackathon-projects.page.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, ProjectCardComponent, KepCardComponent, HackathonTabComponent]
})
export class HackathonProjectsPage extends BaseLoadComponent<HackathonProject[]> implements OnInit {
  public hackathon: Hackathon;
  public projects: HackathonProject[] = [];

  constructor(private hackathonsApiService: HackathonsApiService) {
    super();

    this.hackathon = this.route.snapshot.data.hackathon;
  }

  getData(): Observable<HackathonProject[]> {
    return this.hackathonsApiService.getHackathonProjects(this.hackathon.id);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Projects',
      breadcrumb: {
        type: '',
        links: [
          {name: 'Hackathons', isLink: true, link: '../../..'},
          {name: this.hackathon.id + '', isLink: true, link: '..'},
          {name: 'Projects', isLink: false}
        ]
      }
    };
  }
}
