import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CoreDirectivesModule,
    CorePipesModule,
    TranslateModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CoreDirectivesModule,
    CorePipesModule,
    TranslateModule,
    RouterModule,
  ]
})
export class CoreCommonModule {}
