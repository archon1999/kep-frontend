import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardButtonComponent } from './clipboard-button/clipboard-button.component';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";

@NgModule({
  declarations: [
    ClipboardButtonComponent
  ],
  imports: [
    CommonModule,
    CoreDirectivesModule,
    TranslateModule,
    KepIconComponent,
  ],
  exports: [
    ClipboardButtonComponent,
  ]
})
export class ClipboardModule {}
