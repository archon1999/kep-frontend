import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';

@Directive({
  selector: '[fmSwiper]',
  standalone: true,
})
export class SwiperDirective implements AfterViewInit {

  @Input('config') config?: SwiperOptions;
  private readonly swiperElement: HTMLElement;

  constructor(private el: ElementRef<HTMLElement>) {
    this.swiperElement = el.nativeElement;
  }

  ngAfterViewInit() {
    this.config.injectStyles = [':host { --swiper-theme-color: var(--bs-primary); }'];
    Object.assign(this.el.nativeElement, this.config);

    // @ts-ignore
    this.el.nativeElement.initialize();
  }
}
