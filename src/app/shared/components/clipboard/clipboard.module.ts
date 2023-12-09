import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardButtonComponent } from './clipboard-button/clipboard-button.component';
import { ToastrModule } from 'app/shared/third-part-modules/toastr/toastr.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ClipboardButtonComponent
  ],
  imports: [
    CommonModule,
    ToastrModule,
    CoreDirectivesModule,
    TranslateModule,
  ],
  exports: [
    ClipboardButtonComponent,
  ]
})
export class ClipboardModule { }
