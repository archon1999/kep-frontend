import { Component, Renderer2, ViewEncapsulation } from '@angular/core';

import { ScriptService } from '@shared/services/script.service';

const JQUERY_SCRIPT_PATH = 'https://code.jquery.com/jquery-3.7.1.min.js';
const TWEENMAX_SCRIPT_PATH = '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js';
const DRAGGABLE_SCRIPT_PATH = '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/utils/Draggable.min.js';
const SCRIPT_PATH = 'assets/js/problem-1905.js';

@Component({
  selector: 'problem1905',
  standalone: true,
  imports: [],
  templateUrl: './problem1905.component.html',
  styleUrl: './problem1905.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Problem1905Component {
  constructor(
    private renderer: Renderer2,
    private scriptService: ScriptService
  ) {
    this.scriptService.loadJsScript(this.renderer, JQUERY_SCRIPT_PATH).onload = (e) => {
      this.scriptService.loadJsScript(this.renderer, TWEENMAX_SCRIPT_PATH).onload = (e) => {
        this.scriptService.loadJsScript(this.renderer, DRAGGABLE_SCRIPT_PATH).onload = (e) => {
          this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
        };
      };
    };
  }
}
