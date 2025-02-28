import { Component, OnInit } from '@angular/core';
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';
import { IconNamePipe } from '@shared/pipes/feather-icons.pipe';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectAttemptsComponent } from '@projects/pages/project/project-attempts/project-attempts.component';
import { ProjectDescriptionComponent } from '@projects/pages/project/project-description/project-description.component';
import { ProjectSidebarComponent } from '@projects/pages/project/project-sidebar/project-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { BasePageComponent } from '@app/common';
import { ContentHeader } from "@core/components/content-header/content-header.component";
import { Project } from '@projects/interfaces';
import { CoreCommonModule } from '@core/common.module';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ContentHeaderModule,
    IconNamePipe,
    NgbNavModule,
    ProjectAttemptsComponent,
    ProjectDescriptionComponent,
    ProjectSidebarComponent,
    TranslateModule,
    CoreCommonModule,
    KepCardComponent
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  animations: [fadeInLeftOnEnterAnimation({ translate: '40px' }), fadeInRightOnEnterAnimation({ translate: '40px' })]
})
export class ProjectComponent extends BasePageComponent implements OnInit {
  public project: Project;
  public activeId = 1;

  ngOnInit() {
    this.route.data.subscribe(({project}) => {
      this.project = project;
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, {projectTitle: project.title});
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: this.project.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Projects',
            isLink: true,
            link: this.Resources.Projects,
          },
          {
            name: this.project.slug,
            isLink: false,
          },
        ]
      }
    };
  }
}
