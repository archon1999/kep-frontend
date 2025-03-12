import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Blog } from '../../../blog.models';

@Component({
  selector: 'news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NewsCardComponent {
  @Input() blog: Blog;
}
