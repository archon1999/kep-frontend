import { Component, Input } from '@angular/core';
import { Project } from '@projects/interfaces';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { ProjectTechnologyComponent } from '@projects/components/project-technology/project-technology.component';

@Component({
  selector: 'project-info-card',
  standalone: true,
  imports: [CoreCommonModule, KepcoinViewModule, ProjectTechnologyComponent],
  templateUrl: './project-info-card.component.html',
  styleUrl: './project-info-card.component.scss'
})
export class ProjectInfoCardComponent {
  @Input() project: Project;
}
