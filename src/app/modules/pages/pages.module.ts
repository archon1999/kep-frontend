import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';

import { AuthenticationModule } from './authentication/authentication.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    FormsModule,
    AuthenticationModule,
    MiscellaneousModule,
  ],

  providers: []
})
export class PagesModule {}
