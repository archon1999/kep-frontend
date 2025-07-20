import { Component, OnInit, ViewChild } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { BaseLoadComponent } from '@app/common';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { TranslateModule } from '@ngx-translate/core';
import { HackathonsApiService } from '@hackathons/data-access/hackathons-api.service';
import { Hackathon, HackathonProject } from '@hackathons/domain';
import { ProjectDescriptionComponent } from '@projects/ui/components/project-description/project-description.component';
import { ProjectSidebarComponent } from '@projects/ui/components/project-sidebar/project-sidebar.component';
import { ProjectAttemptsComponent } from '@projects/ui/components/project-attempts/project-attempts.component';
import { HackathonTabComponent } from "@hackathons/ui/components/hackathon-tab/hackathon-tab.component";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { takeUntil } from "rxjs/operators";
import { ContestCardModule } from "@contests/components/contest-card/contest-card.module";
import {
  HackathonCountdownCardComponent
} from "@hackathons/ui/components/hackathon-countdown-card/hackathon-countdown-card.component";

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
    ProjectAttemptsComponent,
    HackathonTabComponent,
    KepCardComponent,
    ContestCardModule,
    HackathonCountdownCardComponent
  ]
})
export class HackathonProjectPage extends BaseLoadComponent<HackathonProject> implements OnInit {
  public hackathonId: number;
  public symbol: string;
  public hackathon: Hackathon;

  @ViewChild(ProjectAttemptsComponent) attemptsComponent: ProjectAttemptsComponent;

  constructor(private hackathonsApiService: HackathonsApiService) {
    super();

    interval(5000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => this.attemptsComponent?.reloadPage()
    )
  }

  override ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hackathonId = +params['id'];
      this.symbol = params['symbol'];
      this.loadData();
      this.loadContentHeader();
    });
    this.hackathon = this.route.snapshot.data.hackathon;
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
          { name: 'Hackathons', isLink: true, link: '../../../../' },
          { name: this.hackathonId + '', isLink: true, link: '../../' },
          { name: this.symbol, isLink: false }
        ]
      }
    };
  }

  reloadAttempts() {
    this.attemptsComponent?.reloadPage();
  }
}
