import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemBodyComponent } from './problem-body.component';
import { CorePipesModule } from 'core/pipes/pipes.module';
import { CoreDirectivesModule } from 'core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { Problem1Component } from './problem1/problem1.component';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { Problem1615Component } from './problem1615/problem1615.component';
import { Problem1623Component } from './problem1623/problem1623.component';
import { Problem1624Component } from './problem1624/problem1624.component';
import { Problem1628Component } from './problem1628/problem1628.component';
import { Problem1630Component } from './problem1630/problem1630.component';
import { Problem1631Component } from './problem1631/problem1631.component';
import { Problem1633Component } from './problem1633/problem1633.component';
import { Problem1634Component } from './problem1634/problem1634.component';
import { Problem1635Component } from './problem1635/problem1635.component';
import { Problem1637Component } from './problem1637/problem1637.component';
import { Problem1638Component } from './problem1638/problem1638.component';
import { Problem1639Component } from './problem1639/problem1639.component';
import { Problem1703Component } from './problem1703/problem1703.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Problem1733Component } from './problem1733/problem1733.component';
import { Problem1734Component } from './problem1734/problem1734.component';
import { Problem1735Component } from './problem1735/problem1735.component';
import { Problem1736Component } from './problem1736/problem1736.component';
import { Problem1737Component } from './problem1737/problem1737.component';
import { Problem1739Component } from './problem1739/problem1739.component';
import { Problem1740Component } from './problem1740/problem1740.component';
import { Problem1741Component } from './problem1741/problem1741.component';
import { Problem1742Component } from './problem1742/problem1742.component';
import { Problem1743Component } from './problem1743/problem1743.component';
import { Problem1744Component } from './problem1744/problem1744.component';
import { Problem1840Component } from './problem1840/problem1840.component';
import { Problem1841Component } from './problem1841/problem1841.component';
import { MonacoEditorModule as MonacoModule } from 'app/shared/third-part-modules/monaco-editor/monaco-editor.module';
import { HtmlProblemBodyComponent } from './html-problem-body/html-problem-body.component';
import { Problem1842Component } from './problem1842/problem1842.component';
import { Problem1843Component } from './problem1843/problem1843.component';
import { ToastrModule } from '@shared/third-part-modules/toastr/toastr.module';
import { Problem1870Component } from './problem1870/problem1870.component';


@NgModule({
  declarations: [
    ProblemBodyComponent,
    Problem1Component,
    Problem1615Component,
    Problem1623Component,
    Problem1624Component,
    Problem1628Component,
    Problem1630Component,
    Problem1631Component,
    Problem1633Component,
    Problem1634Component,
    Problem1635Component,
    Problem1637Component,
    Problem1638Component,
    Problem1639Component,
    Problem1703Component,
    Problem1733Component,
    Problem1734Component,
    Problem1735Component,
    Problem1736Component,
    Problem1737Component,
    Problem1739Component,
    Problem1740Component,
    Problem1741Component,
    Problem1742Component,
    Problem1743Component,
    Problem1744Component,
    Problem1840Component,
    Problem1841Component,
    HtmlProblemBodyComponent,
    Problem1842Component,
    Problem1843Component,
    Problem1870Component,
  ],
  imports: [
    CommonModule,
    CorePipesModule,
    CoreDirectivesModule,
    TranslateModule,
    NgbTooltipModule,
    MathjaxModule,
    ClipboardModule,
    // CountdownModule,
    MonacoEditorModule,
    CodeEditorModule,
    FormsModule,
    MonacoEditorModule,
    MonacoModule,
    ToastrModule,
    ReactiveFormsModule,
  ],
  exports: [
    ProblemBodyComponent,
  ]
})
export class ProblemBodyModule {
}
