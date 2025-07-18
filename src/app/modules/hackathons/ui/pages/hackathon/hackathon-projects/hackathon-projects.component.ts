import { Component, OnInit } from '@angular/core';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ProjectCardComponent } from '@projects/ui/components/project-card/project-card.component';
import { HackathonProject } from '@app/modules/hackathons/domain';
import { BaseLoadComponent } from '@app/common';
import { Observable } from "rxjs";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { HackathonTabComponent } from "@hackathons/ui/pages/hackathon/hackathon-tab/hackathon-tab.component";

@Component({
  selector: 'hackathon-projects',
  templateUrl: './hackathon-projects.component.html',
  styleUrls: ['./hackathon-projects.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, ProjectCardComponent, KepCardComponent, HackathonTabComponent]
})
export class HackathonProjectsComponent extends BaseLoadComponent<HackathonProject[]> implements OnInit {
  public hackathonId: number;
  public projects: HackathonProject[] = [];

  constructor(private hackathonsApiService: HackathonsApiService) {
    super();
  }

  getData(): Observable<HackathonProject[]> {
    return this.hackathonsApiService.getHackathonProjects(this.hackathonId);
  }

  ngOnInit(): void {
    this.hackathonId = this.route.snapshot.params['id'];
    super.ngOnInit();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Projects',
      breadcrumb: {
        type: '',
        links: [
          {name: 'Hackathons', isLink: true, link: '../../..'},
          {name: this.hackathonId + '', isLink: true, link: '..'},
          {name: 'Projects', isLink: false}
        ]
      }
    };
  }
}
