import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreConfigService } from 'core/services/config.service';
import { CoreConfig } from 'core/types';
import { Problem } from '../../../models/problems.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'problem1703',
  templateUrl: './problem1703.component.html',
  styleUrls: ['./problem1703.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Problem1703Component implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public html = ``;

  public outputHtml = '';

  public editorOptions: any;

  public outputX = 0;
  public outputWidth = 100;
  public mouseEnter = false;

  public saveCodeName = 'problem-1703code-editor-codehtml';

  private _unsubscribeAll = new Subject();

  constructor(public coreConfigService: CoreConfigService) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (coreConfig: CoreConfig) => {
        if(coreConfig.layout.skin == 'dark'){
          this.editorOptions = {
            language: 'html',
            theme: 'vs-dark',
            tabSize: 2,
          }
        } else {
          this.editorOptions = {
            language: 'html',
            theme: 'vs-light',
            tabSize: 2,
          }
        }
      }
    )

    let html = localStorage.getItem(this.saveCodeName);
    if(!html){
      html = `
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<div>
  <h3>Hello, World</h3>
</div>
<style>
  div {
    width: 120%;
    height: 120%;
    margin-top: -2rem;
    margin-left: -2rem;
    background: #7367f0;
    font-family: Quicksand;
  }

  h3 {
    padding: 2rem;
  }
</style>`;
    }
    this.html = html;
    this.setOutputHtml();
  }

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e) {
    if(this.mouseEnter){
      this.outputWidth = 100 * e.layerX / 285;
    } else {
      this.outputWidth = 100;
    }
  }

  change(){
    this.setOutputHtml();
  }

  setOutputHtml(){
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
