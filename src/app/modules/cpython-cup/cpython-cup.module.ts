import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CpythonCupComponent } from './cpython-cup.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { SectionTimelineComponent } from './section-timeline/section-timeline.component';

const routes: Routes = [
  { path: '', component: CpythonCupComponent }
];

@NgModule({
  declarations: [
    CpythonCupComponent,
    SectionHeaderComponent,
    SectionTimelineComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    CorePipesModule,
    CoreDirectivesModule,
    // CountdownModule,
  ]
})
export class CpythonCupModule {
}
