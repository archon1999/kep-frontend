import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UserPopoverComponent } from './user-popover/user-popover.component';
import { UserAvatarPopoverComponent } from './user-avatar-popover/user-avatar-popover.component';

@NgModule({
  declarations: [
    UserPopoverComponent,
    UserAvatarPopoverComponent
  ],
  imports: [
    CommonModule,
    NgbPopoverModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    RouterModule,
    NgbTooltipModule
  ],
  exports: [
    UserPopoverComponent,
    UserAvatarPopoverComponent,
  ]
})
export class UserPopoverModule { }
