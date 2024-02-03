import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsService } from './projects.service';
import { ProjectCardComponent } from './project-card/project-card.component';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { KepcoinSpendSwalModule } from '../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectComponent } from './project/project.component';
import { ProjectResolver } from './projects.resolver';
import { NgbAccordionModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProjectSidebarComponent } from './project/project-detail/project-sidebar/project-sidebar.component';
import { ProjectDescriptionComponent } from './project/project-detail/project-description/project-description.component';
import { ProjectAttemptsComponent } from './project/project-detail/project-attempts/project-attempts.component';
import { FormsModule } from '@angular/forms';
import { AttemptsTableComponent } from './project/project-detail/project-attempts/attempts-table/attempts-table.component';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';


const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    title: 'Projects.Projects',
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
    data: { title: 'Projects.Project' },
    resolve: {
      project: ProjectResolver,
    }
  },
  {
    path: 'project/:id/detail',
    component: ProjectDetailComponent,
    data: { title: 'Projects.Project' },
    resolve: {
      project: ProjectResolver,
    }
  },
];


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    ProjectComponent,
    ProjectDetailComponent,
    ProjectSidebarComponent,
    ProjectDescriptionComponent,
    ProjectAttemptsComponent,
    AttemptsTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreDirectivesModule,
    CorePipesModule,
    ContentHeaderModule,
    KepcoinSpendSwalModule,
    TranslateModule,
    FormsModule,
    NgbTooltipModule,
    NgbNavModule,
    UserPopoverModule,
    NgbAccordionModule,
  ],
  providers: [
    ProjectsService,
    ProjectResolver,
  ],
  exports: [
    AttemptsTableComponent
  ]
})
export class ProjectsModule { }
