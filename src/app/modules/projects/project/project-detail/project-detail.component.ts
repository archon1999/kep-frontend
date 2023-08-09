import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Project } from '../../projects.models';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss', '../../projects.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
  ]
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  public contentHeader: ContentHeader;

  public activeId = 1;

  public project: Project;

  constructor(
    public route: ActivatedRoute,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ project }) => {
      this.project = project;
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { projectTitle: project.title })
    })
  }

  loadContentHeader() {
    this.contentHeader = {
      headerTitle: this.project.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Projects',
            isLink: true,
            link: '/practice/projects',
          },
          {
            name: this.project.id+"",
            isLink: false,
          },
        ]
      }
    };
  }

  ngOnDestroy(): void {
  }

}
