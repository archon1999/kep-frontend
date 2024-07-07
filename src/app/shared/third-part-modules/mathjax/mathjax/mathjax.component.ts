import { Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { ScriptService } from '@shared/services/script.service';

const SCRIPT_PATH = '/static/frontend/assets/js/tex-chtml.js';

@Component({
  selector: 'mathjax',
  inputs: ['content'],
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss'],
})
export class MathjaxComponent implements OnInit, OnChanges {

  @Input() content: string;

  constructor(
    private renderer: Renderer2,
    private scriptService: ScriptService
  ) {
  }

  ngOnInit() {
    if (!window['MathJax']) {
      window['MathJax'] = {
        tex: {
          inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
          ]
        },
        CommonHTML: { linebreaks: { automatic: true } },
        'HTML-CSS': { linebreaks: { automatic: true } },
        SVG: { linebreaks: { automatic: true } },
        startup: {
          ready: () => {
            window['MathJax'].startup.defaultReady();
          }
        }
      };
      const scriptElement = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
      scriptElement.onload = (e) => {};
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      setTimeout(() => {
        if (window['MathJax']) {
          try {
            window['MathJax'].typesetPromise();
          } catch (e) {}
        }
      });
    }
  }

}
