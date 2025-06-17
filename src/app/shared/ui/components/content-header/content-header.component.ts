import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInLeftAnimation, fadeInUpAnimation } from 'angular-animations';

export interface ContentHeader {
  headerTitle: string;
  breadcrumb?: {
    type?: string;
    links?: Array<{
      name?: string;
      isLink?: boolean;
      link?: string;
    }>;
  };
  refreshVisible?: boolean;
}

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  standalone: false,
})
export class ContentHeaderComponent implements OnInit {
  @Input() contentHeader: ContentHeader;
  @Input() refreshVisible = false;
  @Input() hasActions = false;
  @Output() refresh = new EventEmitter<null>();

  public animationState = false;

  constructor(
    public router: Router,
  ) {}

  ngOnInit() {
    setTimeout(() => this.animationState = true);
  }
}
