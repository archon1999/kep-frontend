import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersChartCardComponent } from './users-chart-card/users-chart-card.component';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { UserPopoverModule } from '../user-popover/user-popover.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UsersChartCardComponent
  ],
  imports: [
    CommonModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    UserPopoverModule,
    NgApexchartsModule
  ],
  exports: [
    UsersChartCardComponent
  ]
})
export class UsersChartModule { }
