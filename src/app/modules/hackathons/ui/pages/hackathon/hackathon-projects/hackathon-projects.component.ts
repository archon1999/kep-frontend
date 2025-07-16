import { Component, OnInit } from '@angular/core';
import { HackathonsApiService } from '@app/modules/hackathons/data-access/hackathons-api.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ProjectCardComponent } from '@projects/ui/components/project-card/project-card.component';
import { HackathonProject } from '@app/modules/hackathons/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BasePageComponent } from '@app/common';

@Component({
  selector: 'hackathon-projects',
  templateUrl: './hackathon-projects.component.html',
  styleUrls: ['./hackathon-projects.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, ContentHeaderModule, ProjectCardComponent, KepCardComponent]
})
export class HackathonProjectsComponent extends BasePageComponent implements OnInit {
  public hackathonId: number;
  public projects: HackathonProject[] = [];

  constructor(private api: HackathonsApiService) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hackathonId = params['id'];
      this.api.getHackathonProjects(this.hackathonId).subscribe(projects => this.projects = projects);
      this.loadContentHeader();
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Projects',
      breadcrumb: {
        type: '',
        links: [
          { name: 'Hackathons', isLink: true, link: '../../..' },
          { name: this.hackathonId + '', isLink: true, link: '..' },
          { name: 'Projects', isLink: false }
        ]
      }
    };
  }
}
