import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardButtonComponent } from './clipboard-button/clipboard-button.component';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ClipboardButtonComponent
  ],
  imports: [
    CommonModule,
    CoreDirectivesModule,
    TranslateModule,
  ],
  exports: [
    ClipboardButtonComponent,
  ]
})
export class ClipboardModule {}
