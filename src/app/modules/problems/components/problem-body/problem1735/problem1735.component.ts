import { Component, HostListener, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Problem } from '../../../models/problems.models';
import { Subject } from 'rxjs';
import { CoreCommonModule } from '@core/common.module';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'problem1735',
  templateUrl: './problem1735.component.html',
  styleUrls: ['./problem1735.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [CoreCommonModule, MonacoEditorModule]
})
export class Problem1735Component implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public html = ``;

  public outputHtml = '';

  public editorOptions: any = {
    language: 'html',
    theme: 'vs-dark',
    tabSize: 2,
  };

  public outputX = 0;
  public outputWidth = 100;
  public mouseEnter = false;

  public saveCodeName = 'problem-1735code-editor-codehtml';

  private _unsubscribeAll = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.html = localStorage.getItem(this.saveCodeName) || this.problem.availableLanguages[0].codeTemplate;
    this.setOutputHtml();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    if (this.mouseEnter) {
      this.outputWidth = 100 * e.layerX / 250;
    } else {
      this.outputWidth = 100;
    }
  }

  change() {
    this.setOutputHtml();
  }

  setOutputHtml() {
    localStorage.setItem(this.saveCodeName, this.html);
    let html = this.html.replace(/<\s*img/, '<imga');
    this.outputHtml = `
      <html style="height: 100%; width: 100%;">
        <body style="overflow: hidden; height: 100%; width: 100%;">
          ${html}
        </body>
      </html>
    `
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
