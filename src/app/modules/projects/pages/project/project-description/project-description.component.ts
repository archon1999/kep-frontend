import { Component, Input } from '@angular/core';

import { Project } from '@app/modules/projects/interfaces/project';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';

@Component({
  selector: 'project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss'],
  standalone: true,
  imports: [
    NgbAccordionModule,
    CoreCommonModule,
    KepcoinViewModule
  ]
})
export class ProjectDescriptionComponent {
  @Input() project: Project;
}
