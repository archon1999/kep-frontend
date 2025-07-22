import { Component, Input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { ProjectTechnologyComponent } from '@projects/ui/components/project-technology/project-technology.component';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Project } from "@projects/domain/entities";
import { Hackathon, HackathonProject } from "@hackathons/domain";

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    KepcoinSpendSwalModule,
    ProjectTechnologyComponent,
    KepcoinViewModule,
    KepCardComponent
  ]
})
export class ProjectCardComponent {
  @Input() project: Project;
  @Input() hackathonProject: HackathonProject;
}
