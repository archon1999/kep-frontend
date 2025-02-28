import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexChartComponent } from './apex-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    ApexChartComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  exports: [
    ApexChartComponent,
  ]
})
export class ApexChartModule {}
