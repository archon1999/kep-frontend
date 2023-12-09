import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CoreSidebarModule } from 'core/components/core-sidebar/core-sidebar.module';

import { CoreThemeCustomizerComponent } from 'core/components/theme-customizer/theme-customizer.component';
import { NgScrollbar } from 'ngx-scrollbar';

@NgModule({
  declarations: [CoreThemeCustomizerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    NgScrollbar
  ],
  exports: [CoreThemeCustomizerComponent]
})
export class CoreThemeCustomizerModule {}
