import { Component, Input } from '@angular/core';
import { Blog } from '../../../blog.models';

@Component({
  selector: 'blog-post-card',
  templateUrl: './blog-post-card.component.html',
  styleUrls: ['./blog-post-card.component.scss']
})
export class BlogPostCardComponent {
  @Input() blog: Blog;
  @Input() cardImgHeight = 250;
}
