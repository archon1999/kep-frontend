import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mathjax',
  inputs: ['content'],
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss'],
})
export class MathjaxComponent implements OnInit, OnChanges {

  @Input() content: string;

  constructor() {}

  ngOnInit() {
    console.log(window['MathJax']);
    window['MathJax'].typeset();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      window['MathJax'].typeset();
    }
  }

}
