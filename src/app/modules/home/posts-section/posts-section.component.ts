import { AfterViewInit, Component } from '@angular/core';

import { Blog } from '../../blog/blog.interfaces';
import { HomeService } from '../home.service';
import { PageResult } from '@core/common/classes/page-result';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { BlogPostCardComponent } from '@app/modules/blog/components/blog-post-card/blog-post-card.component';

const PAGE_SIZE = 6;

@Component({
  selector: 'posts-section',
  standalone: true,
  imports: [SpinnerComponent, CarouselModule, KepCardComponent, BlogPostCardComponent],
  templateUrl: './posts-section.component.html',
  styleUrl: './posts-section.component.scss'
})
export class PostsSectionComponent implements AfterViewInit {

  public lastPosts: Array<Blog> = [];
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 100,
    autoplay: false,
    navText: ['<', '>'],
    autoplaySpeed: 5000,
    responsive: {
      0: {
        items: 1,
        margin: 0,
      },
      768: {
        items: 2,
        margin: 50,
      },
    },
    nav: false,
  };

  constructor(public service: HomeService) {}

  ngAfterViewInit() {
    this.service.getLastPosts(1, PAGE_SIZE).subscribe(
      (result: PageResult<Blog>) => {
        this.lastPosts = result.data;
      }
    );
  }

}
