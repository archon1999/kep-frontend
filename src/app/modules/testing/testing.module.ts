import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';
import { DragulaModule } from 'ng2-dragula';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { KepcoinSpendSwalModule } from '../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { SweetAlertModule } from '@shared/third-part-modules/sweet-alert/sweet-alert.module';
import { ChapterCardComponent } from '@app/modules/testing/components/chapter-card/chapter-card.component';
import { TestCardComponent } from '@app/modules/testing/components/test-card/test-card.component';
import { TestPassComponent } from '@app/modules/testing/pages/test-pass/test-pass.component';
import { TestComponent } from '@app/modules/testing/pages/test/test.component';
import { TestsComponent } from '@app/modules/testing/pages/tests/tests.component';
import { ChaptersResolver, LastTestsResolver, TestPassResolver, TestResolver } from './testing.resolver';
import { TestListCardComponent } from '@app/modules/testing/components/test-list-card/test-list-card.component';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import {
  ChapterWithTestsCardComponent
} from '@app/modules/testing/components/chapter-with-tests-card/chapter-with-tests-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

const routes: Routes = [
  {
    path: '',
    component: TestsComponent,
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
    TestsComponent,
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
    MathjaxModule,
    SweetAlertModule,
    MonacoEditorComponent,
    DragulaModule.forRoot(),
    SwiperComponent,
    CountdownComponent,
    ChapterWithTestsCardComponent,
    SpinnerComponent,
    KepCardComponent,
  ],
  providers: [
    TestResolver,
    TestPassResolver,
    ChaptersResolver,
    LastTestsResolver
  ]
})
export class TestingModule {
}
