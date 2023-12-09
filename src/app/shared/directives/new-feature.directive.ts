import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[new-feature]',
  standalone: true
})
export class NewFeatureDirective {
  constructor(private el: ElementRef<HTMLElement>) {
    el.nativeElement.innerHTML += '<span class="badge badge-glow badge-warning new-feature">New</span>'
  }
}
