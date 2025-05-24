import { Component, Input } from '@angular/core';

@Component({
  selector: 'project-technology',
  standalone: true,
  imports: [],
  templateUrl: './project-technology.component.html',
  styleUrl: './project-technology.component.scss'
})
export class ProjectTechnologyComponent {
  @Input() name: string;
}
