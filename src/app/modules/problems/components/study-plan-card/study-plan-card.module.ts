import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StudyPlanCardComponent } from './study-plan-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@NgModule({
  declarations: [
    StudyPlanCardComponent,
  ],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
    ResourceByIdPipe,
  ],
  exports: [
    StudyPlanCardComponent,
  ]
})
export class StudyPlanCardModule {}
