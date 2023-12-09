import { Component, OnInit, Input } from '@angular/core';

export interface Breadcrumb {
  type?: string;
  alignment?: string;
  links?: Array<{
    name?: string;
    isLink?: boolean;
    link?: string;
  }>;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  @Input() breadcrumb: Breadcrumb;
}
