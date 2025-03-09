import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ProjectsService } from '../../projects.service';
import { Project } from '@app/modules/projects/interfaces/project';
import { CoreCommonModule } from '@core/common.module';
import { ProjectCardComponent } from '@app/modules/projects/components/project-card/project-card.component';
import { BaseLoadComponent } from '@app/common';
import { ContentHeader } from '@core/components/content-header/content-header.component';
import { Observable } from 'rxjs';
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
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
export class ProjectsComponent extends BaseLoadComponent<Project[]> implements OnInit {

  constructor(public service: ProjectsService) {
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
    return this.service.getProjects();
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
