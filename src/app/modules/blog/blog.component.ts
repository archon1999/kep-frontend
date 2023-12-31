import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { Blog } from './blog.models';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
  ]
})
export class BlogComponent implements OnInit {

  public contentHeader: ContentHeader = {
    headerTitle: 'Blog',
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'KEP.uz',
          isLink: false,
        },
      ]
    }
  };

  public blogPosts: Array<Blog> = [];
  public total = 0;

  public allAuthors = [];

  public filter = {
    page: 1,
    title: '',
    author: null,
    orderBy: null,
    topic: 0,
  }

  constructor(
    public service: BlogService,
  ) { }

  ngOnInit(): void {
    this.loadBlogPosts();

    this.service.getAllAuthors().subscribe(
      (result: any) => {
        this.allAuthors = result;
      }
    )
  }

  loadBlogPosts(){
    this.service.getBlogPosts(this.filter).subscribe(
      (result: any) => {
        this.blogPosts = result.data;
        this.total = result.total;
      }
    )
  }

}
