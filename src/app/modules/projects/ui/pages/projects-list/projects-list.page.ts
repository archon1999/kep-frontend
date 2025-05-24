import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { ProjectCardComponent } from '@projects/ui/components/project-card/project-card.component';
import { BaseLoadComponent } from '@app/common';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { Observable } from 'rxjs';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProjectsRepository } from "@projects/data-access";
import { Project } from "@projects/domain/entities/project";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.page.html',
  styleUrls: ['./projects-list.page.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 200 }),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ProjectCardComponent,
    ContentHeaderModule,
    NgxSkeletonLoaderModule
  ]
})
export class ProjectsListPage extends BaseLoadComponent<Project[]> implements OnInit {
  constructor(public repository: ProjectsRepository) {
    super();
  }

  get projects() {
    return this.data;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadContentHeader();
  }

  getData(): Observable<Project[]> {
    return this.repository.list();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'MENU.PROJECTS',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Practice',
            isLink: false,
          },
          {
            name: 'MENU.PROJECTS',
            isLink: false,
          },
        ]
      }
    };
  }
}
