import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { Project } from './projects.models';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
    fadeInOnEnterAnimation({ duration: 3000 }),
  ]
})
export class ProjectsComponent implements OnInit {

  public projects: Array<Project> = [];

  public contentHeader = {
    headerTitle: 'MENU.PROJECTS',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'CPython.uz',
          isLink: false,
        },
      ]
    }
  };

  constructor(
    public service: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.service.getProjects().subscribe(
      (projects: Array<Project>) => {
        this.projects = projects;
      }
    )
  }

}
