import { Component, inject, ViewEncapsulation } from '@angular/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { BaseLoadComponent } from "@core/common";
import { Observable } from "rxjs";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { UsersApiService } from "@users/data-access";

@Component({
  selector: 'ranks-section',
  standalone: true,
  imports: [
    KepIconComponent,
    CoreCommonModule,
    NgbTooltip,
    KepcoinViewModule,
    KepCardComponent,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './ranks-section.component.html',
  styleUrl: './ranks-section.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RanksSectionComponent extends BaseLoadComponent<any> {
  ranks = [
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
    return this.userApiService.getUserRatings(this.currentUser.username);
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
