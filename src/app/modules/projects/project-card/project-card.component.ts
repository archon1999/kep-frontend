import { Component, Input, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Project } from '../projects.models';

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss', '../projects.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 3000 })]
})
export class ProjectCardComponent implements OnInit {

  @Input() project: Project;

  constructor() { }

  ngOnInit(): void {
  }

}
