import { Component, inject, Input, OnInit } from '@angular/core';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BaseLoadComponent } from '@core/common';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Observable } from "rxjs";
import { Project } from "@projects/domain/entities";
import { ProjectsRepository } from "@projects/data-access";
import { ProjectDescriptionComponent } from "@projects/ui/components/project-description/project-description.component";
import { ProjectAttemptsComponent } from "@projects/ui/components/project-attempts/project-attempts.component";
import { ProjectSidebarComponent } from "@projects/ui/components/project-sidebar/project-sidebar.component";

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    ContentHeaderModule,
    NgbNavModule,
    TranslateModule,
    CoreCommonModule,
    KepCardComponent,
    ProjectDescriptionComponent,
    ProjectAttemptsComponent,
    ProjectSidebarComponent
  ],
  templateUrl: './project-detail.page.html',
  styleUrl: './project-detail.page.scss',
})
export class ProjectDetailPage extends BaseLoadComponent<Project> implements OnInit {
  @Input() slug: string;

  public activeId = 1;

  protected readonly projectsRepository = inject(ProjectsRepository);

  override ngOnInit() {
    this.isLoading = true;

    this.route.params.subscribe(
      (params) => {
        if (params.slug) {
          this.slug = params.slug;
          this.loadData();
        }
      }
    )
  }

  getData(): Observable<Project> {
    return this.projectsRepository.byId(this.slug);
  }

  afterLoadData(data: Project) {
    this.titleService.updateTitle(this.route, {projectTitle: data.title});
    this.loadContentHeader();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: this.data.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Projects',
            isLink: true,
            link: this.Resources.Projects,
          },
          {
            name: this.data.slug,
            isLink: false,
          },
        ]
      }
    };
  }
}
