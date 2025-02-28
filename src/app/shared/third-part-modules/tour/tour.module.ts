import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourComponent } from './tour.component';


@NgModule({
  declarations: [
    TourComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [TourComponent]
})
export class TourModule {}
