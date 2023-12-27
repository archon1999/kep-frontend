import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptService } from '@shared/services/script.service';

const SCRIPT_PATH = 'assets/js/problem-1869.js';

@Component({
  selector: 'problem1869',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem1869.component.html',
  styleUrl: './problem1869.component.scss'
})
export class Problem1869Component {
  constructor(
    private renderer: Renderer2,
    private scriptService: ScriptService
  ) {
    const scriptElement = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
  }
}
