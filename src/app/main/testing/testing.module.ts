import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CountdownModule } from '@ciri/ngx-countdown';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { DragulaModule } from 'ng2-dragula';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { CodeEditorModule } from '../elements/code-editor/code-editor.module';
import { UserPopoverModule } from '../elements/user-popover/user-popover.module';
import { KepcoinSpendSwalModule } from '../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { MathjaxModule } from '../third-part-modules/mathjax/mathjax.module';
import { SweetAlertModule } from '../third-part-modules/sweet-alert/sweet-alert.module';
import { ChapterCardComponent } from './chapter-card/chapter-card.component';
import { TestCardComponent } from './test-card/test-card.component';
import { TestPassComponent } from './test-pass/test-pass.component';
import { TestComponent } from './test/test.component';
import { TestingComponent } from './testing.component';
import { ChaptersResolver, LastTestsResolver, TestPassResolver, TestResolver } from './testing.resolver';
import { TestListCardComponent } from './test-list-card/test-list-card.component';

const routes: Routes = [
  {
    path: '',
    component: TestingComponent,
    title: 'Tests.Tests',
    resolve: {
      chapters: ChaptersResolver,
      lastTests: LastTestsResolver,
    }
  },
  {
    path: 'test/:testId',
    component: TestComponent,
    data: {
      title: 'Tests.Test',
    },
    resolve: {
      test: TestResolver,
    }
  },
  {
    path: 'test-pass/:testPassId',
    component: TestPassComponent,
    data: {
      title: 'Tests.TestPass',
    },
    resolve: {
      testPass: TestPassResolver,
    },
  }

];

@NgModule({
  declarations: [
    TestingComponent,
    TestComponent,
    TestPassComponent,
    TestCardComponent,
    ChapterCardComponent,
    TestListCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    CorePipesModule,
    CoreDirectivesModule,
    UserPopoverModule,
    KepcoinSpendSwalModule,
    NgbTooltipModule,
    TranslateModule,
    FormsModule,
    CodeEditorModule,
    MonacoEditorModule,
    MathjaxModule,
    CountdownModule,
    SweetAlertModule,
    NgxUsefulSwiperModule,
    DragulaModule.forRoot(),
  ],
  providers: [
    TestResolver,
    TestPassResolver,
    ChaptersResolver,
    LastTestsResolver
  ]
})
export class TestingModule { }
