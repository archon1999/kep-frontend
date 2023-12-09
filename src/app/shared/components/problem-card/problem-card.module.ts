import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemCardComponent } from './problem-card.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { ProblemsPipesModule } from '../../../modules/problems/pipes/problems-pipes.module';

@NgModule({
  declarations: [
    ProblemCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CoreDirectivesModule,
    CorePipesModule,
    ProblemsPipesModule,
  ],
  exports: [
    ProblemCardComponent,
  ]
})
export class ProblemCardModule { }
