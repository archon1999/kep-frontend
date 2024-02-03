import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

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
    KepIconComponent,
    SpinnerComponent
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
    KepIconComponent,
    SpinnerComponent
  ]
})
export class CoreCommonModule {}
