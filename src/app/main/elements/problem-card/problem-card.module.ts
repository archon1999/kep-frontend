import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemCardComponent } from './problem-card.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';

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
  ],
  exports: [
    ProblemCardComponent,
  ]
})
export class ProblemCardModule { }
