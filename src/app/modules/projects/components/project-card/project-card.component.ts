import { Component, Input } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

import { Project } from '@app/modules/projects/interfaces/project';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { KepcoinSpendSwalModule } from '@app/modules/kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { ProjectTechnologyComponent } from '@projects/components/project-technology/project-technology.component';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  animations: [fadeInOnEnterAnimation()],
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
}
