import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../../blog/blog.models';

@Component({
  selector: 'user-blog',
  templateUrl: './user-blog.component.html',
  styleUrls: ['./user-blog.component.scss']
})
export class UserBlogComponent implements OnInit {

  public userBlog: Array<Blog> = [];

  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ userBlog }) => {
      this.userBlog = userBlog.data;
    })
  }

}
