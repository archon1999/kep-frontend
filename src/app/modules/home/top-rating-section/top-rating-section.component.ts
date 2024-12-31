import { Component, OnInit } from '@angular/core';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { User } from '@auth';
import { HomeService } from '../home.service';

@Component({
  selector: 'top-rating-section',
  standalone: true,
  imports: [NgxSkeletonLoaderModule, TranslateModule, UserPopoverModule],
  templateUrl: './top-rating-section.component.html',
  styleUrl: './top-rating-section.component.scss'
})
export class TopRatingSectionComponent implements OnInit {

  public topUsers: Array<User> = [];
  public topRatingSkeletonVisible = true;

  constructor(public service: HomeService) {}

  ngOnInit() {
    this.service.getTopUsers()
      .subscribe((result: any) => {
        this.topUsers = result;
        this.topRatingSkeletonVisible = false;
      });
  }

}
