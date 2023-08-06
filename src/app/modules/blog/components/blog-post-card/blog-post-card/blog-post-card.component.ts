import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Blog } from '../../../blog.models';

@Component({
  selector: 'blog-post-card',
  templateUrl: './blog-post-card.component.html',
  styleUrls: ['./blog-post-card.component.scss']
})
export class BlogPostCardComponent implements OnInit {

  @Input() blog: Blog;

  @Input() cardImgHeight = 250;

  @ViewChild('container') container: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

}
