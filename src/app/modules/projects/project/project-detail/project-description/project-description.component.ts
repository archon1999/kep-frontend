import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../../projects/projects.models';

@Component({
  selector: 'project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss', '../../../projects.scss']
})
export class ProjectDescriptionComponent implements OnInit {

  @Input() project: Project;

  constructor() { }

  ngOnInit(): void {
  }

}
