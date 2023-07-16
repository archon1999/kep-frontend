import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardButtonComponent } from './clipboard-button/clipboard-button.component';
import { ToastrModule } from 'ngx-toastr';
import { CoreDirectivesModule } from '../../../../@core/directives/directives';
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
