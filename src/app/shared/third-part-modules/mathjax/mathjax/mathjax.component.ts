import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// const MathJax = Window['mathjax'];
@Component({
  selector: "mathjax",
  inputs: ["content"],
  templateUrl: "./mathjax.component.html",
  styleUrls: ["./mathjax.component.scss"]
})
export class MathjaxComponent implements AfterViewInit, OnChanges {
  @Input() content: string;

  constructor() {}
  mathJaxObject;
  ngOnChanges(changes: SimpleChanges) {
    if (changes["content"]) {
      this.renderMath();
    }
  }

  renderMath() {
    this.mathJaxObject = window["MathJax"];
    let angObj = this;
    setTimeout(() => {
      angObj.mathJaxObject.Hub.Queue(
        ["Typeset", angObj.mathJaxObject.Hub],
      );
    }, 50);
  }
  loadMathConfig() {
    this.mathJaxObject = window["MathJax"];
    this.mathJaxObject.Hub.Config({
      showMathMenu: false,
      tex2jax: {
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"]
        ]
      },
      menuSettings: { zoom: "Double-Click", zscale: "150%" },
      CommonHTML: { linebreaks: { automatic: true } },
      "HTML-CSS": { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } }
    });
  }

  ngAfterViewInit() {
    this.loadMathConfig();
    this.renderMath();
  }
}
