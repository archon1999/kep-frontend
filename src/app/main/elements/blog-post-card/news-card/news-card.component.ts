import { Component, Input, OnInit } from '@angular/core';
import { Blog } from 'app/main/blog/blog.models';

@Component({
  selector: 'news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent implements OnInit {

  @Input() blog: Blog;

  constructor() { }

  ngOnInit(): void {
  }

}
