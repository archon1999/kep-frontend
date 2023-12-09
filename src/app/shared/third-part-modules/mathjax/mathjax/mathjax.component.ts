import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mathjax',
  inputs: ['content'],
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss'],
})
export class MathjaxComponent implements AfterViewInit, OnChanges {

  @Input() content: string;

  constructor() {}

  ngAfterViewInit() {
    window['MathJax'].typesetPromise();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      window['MathJax'].typesetPromise();
    }
  }

}
