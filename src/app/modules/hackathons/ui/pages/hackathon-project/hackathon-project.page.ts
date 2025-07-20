import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseLoadComponent } from '@app/common';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { TranslateModule } from '@ngx-translate/core';
import { HackathonsApiService } from '@hackathons/data-access/hackathons-api.service';
import { HackathonProject } from '@hackathons/domain';
import { ProjectDescriptionComponent } from '@projects/ui/components/project-description/project-description.component';
import { ProjectSidebarComponent } from '@projects/ui/components/project-sidebar/project-sidebar.component';
import { ProjectAttemptsComponent } from '@projects/ui/components/project-attempts/project-attempts.component';

@Component({
  selector: 'hackathon-project',
  templateUrl: './hackathon-project.page.html',
  styleUrls: ['./hackathon-project.page.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    TranslateModule,
    ProjectDescriptionComponent,
    ProjectSidebarComponent,
    ProjectAttemptsComponent
  ]
})
export class HackathonProjectPage extends BaseLoadComponent<HackathonProject> implements OnInit {
  public hackathonId: number;
  public symbol: string;

  @ViewChild(ProjectAttemptsComponent) attemptsComponent: ProjectAttemptsComponent;

  constructor(private hackathonsApiService: HackathonsApiService) {
    super();
  }

  override ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hackathonId = +params['id'];
      this.symbol = params['symbol'];
      this.loadData();
      this.loadContentHeader();
    });
  }

  getData(): Observable<HackathonProject> {
    return this.hackathonsApiService.getHackathonProject(this.hackathonId, this.symbol);
  }

  override afterLoadData(data: HackathonProject) {
    this.titleService.updateTitle(this.route, { projectTitle: data.project.title });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: this.data?.project.title ?? 'Project',
      breadcrumb: {
        type: '',
        links: [
          { name: 'Hackathons', isLink: true, link: '../../..' },
          { name: this.hackathonId + '', isLink: true, link: '..' },
          { name: this.symbol, isLink: false }
        ]
      }
    };
  }

  reloadAttempts() {
    this.attemptsComponent?.reloadPage();
  }
}
