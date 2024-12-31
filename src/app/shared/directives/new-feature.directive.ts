import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[new-feature]',
  standalone: true
})
export class NewFeatureDirective implements OnInit {
  @Input() show = true;

  constructor(public el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    if (this.show) {
      setTimeout(() => {
        const element = document.createElement('div');
        element.innerHTML = '<span class="badge badge-glow bg-warning new-feature">New</span>';
        this.el.nativeElement.appendChild(element);
      });
    }
  }
}
