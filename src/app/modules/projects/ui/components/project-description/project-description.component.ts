import { Component, Input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { Project } from "@projects/domain/entities";

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
