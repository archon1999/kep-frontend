import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { ProjectTechnologyComponent } from '@projects/ui/components/project-technology/project-technology.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Project } from "@projects/domain/entities";

@Component({
  selector: 'project-info-card',
  standalone: true,
  imports: [CoreCommonModule, KepcoinViewModule, ProjectTechnologyComponent, KepCardComponent],
  templateUrl: './project-info-card.component.html',
  styleUrl: './project-info-card.component.scss'
})
export class ProjectInfoCardComponent {
  @Input() project: Project;
}
