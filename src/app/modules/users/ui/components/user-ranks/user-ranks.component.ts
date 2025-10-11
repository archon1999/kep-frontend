import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { BaseLoadComponent } from "@core/common";
import { Observable } from "rxjs";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { UsersApiService } from "@users/data-access";

@Component({
  selector: 'user-ranks',
  standalone: true,
  imports: [
    KepIconComponent,
    CoreCommonModule,
    KepcoinViewModule,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './user-ranks.component.html',
  styleUrl: './user-ranks.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserRanksComponent extends BaseLoadComponent<any> {
  @Input() username: string;

  public ranks = [
    {
      name: 'SkillsRating',
      value: 67.2,
      rank: 13,
      icon: 'rating',
      percentile: 98.2,
    },
    {
      name: 'ActivityRating',
      value: 22.2,
      rank: 22,
      icon: 'rating',
      percentile: 98.2,
    },
    {
      name: 'Contests.Contests',
      value: 2080,
      rank: 9,
      icon: 'contests',
      percentile: 98.2,
    },
    {
      name: 'Challenges',
      value: 1792,
      rank: 19,
      icon: 'challenges',
      percentile: 98.2,
    }
  ];

  protected userApiService = inject(UsersApiService);

  getData(): Observable<any> {
    return this.userApiService.getUserRatings(this.username);
  }

  afterLoadData(data: any) {
    this.ranks[0] = {
      ...this.ranks[0],
      ...data.skillsRating,
    }
    this.ranks[1] = {
      ...this.ranks[1],
      ...data.activityRating,
    }
    this.ranks[2] = {
      ...this.ranks[2],
      ...data.contestsRating,
    }
    this.ranks[3] = {
      ...this.ranks[3],
      ...data.challengesRating,
    }
  }
}
