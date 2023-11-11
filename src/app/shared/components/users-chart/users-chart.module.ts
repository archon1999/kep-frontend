import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersChartCardComponent } from './users-chart-card/users-chart-card.component';
import { CorePipesModule } from '../../../../core/pipes/pipes.module';
import { UserPopoverModule } from '../user-popover/user-popover.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CoreDirectivesModule } from '../../../../core/directives/directives';
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
