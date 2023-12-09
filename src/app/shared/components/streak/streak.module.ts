import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { StreakComponent } from './streak.component';

@NgModule({
  declarations: [
    StreakComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CoreDirectivesModule,
    CorePipesModule,
  ],
  exports: [
    StreakComponent,
  ]
})
export class StreakModule { }
