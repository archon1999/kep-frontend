import { Component, OnInit } from '@angular/core';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { AuthUser } from '@auth';
import { HomeService } from '../home.service';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'top-rating-section',
  standalone: true,
  imports: [NgxSkeletonLoaderModule, TranslateModule, UserPopoverModule, KepCardComponent],
  templateUrl: './top-rating-section.component.html',
  styleUrl: './top-rating-section.component.scss'
})
export class TopRatingSectionComponent implements OnInit {

  public topUsers: Array<AuthUser> = [];
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
