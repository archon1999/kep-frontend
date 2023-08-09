import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { TitleService } from 'app/shared/services/title.service';
import { Project } from '../projects.models';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss', '../projects.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
    fadeInOnEnterAnimation({ duration: 3000 }),
  ]
})
export class ProjectComponent implements OnInit, OnDestroy {

  public project: Project;

  constructor(
    public route: ActivatedRoute,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    document.getElementsByTagName('body')[0].classList.add('project-page');

    this.route.data.subscribe(({ project }) => {
      this.project = project;
      this.titleService.updateTitle(this.route, { projectTitle: project.title })
    })
  }

  ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('project-page');
  }

}
