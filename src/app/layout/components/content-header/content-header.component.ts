import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInLeftAnimation, fadeInUpAnimation } from 'angular-animations';

// ContentHeader component interface
export interface ContentHeader {
  headerTitle: string;
  actionButton: boolean;
  breadcrumb?: {
    type?: string;
    links?: Array<{
      name?: string;
      isLink?: boolean;
      link?: string;
    }>;
  };
}

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  animations: [fadeInLeftAnimation({ duration: 2000 }), fadeInUpAnimation()]
})
export class ContentHeaderComponent implements OnInit {
  animationState: boolean = false;

  @Input() contentHeader: ContentHeader;

  constructor(
    public router: Router,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }

  refreshPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate([this.router.url], {skipLocationChange: true})
  }

}
