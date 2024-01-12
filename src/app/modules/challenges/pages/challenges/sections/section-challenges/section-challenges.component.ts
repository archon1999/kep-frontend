import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from '@challenges/components/challenge-card/challenge-card.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PageResult } from '@shared/components/classes/page-result';
import { Challenge } from '@challenges/models';
import { BaseTablePageComponent } from '@shared/components/classes/base-table-page.component';
import { ChallengesApiService } from '@challenges/services';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'section-challenges',
  standalone: true,
  imports: [CommonModule, ChallengeCardComponent, KepPaginationComponent, NgxSkeletonLoaderModule, SpinnerComponent],
  templateUrl: './section-challenges.component.html',
  styleUrl: './section-challenges.component.scss'
})
export class SectionChallengesComponent extends BaseTablePageComponent<Challenge> {
  override defaultPageSize = 7;
  override maxSize = 5;

  constructor(public service: ChallengesApiService) {
    super();
  }

  get challenges() {
    return this.pageResult?.data;
  }

  getPage(): Observable<PageResult<Challenge>> | null {
    return this.service.getChallenges({
      page: this.pageNumber,
      pageSize: this.pageSize,
    });
  }
}
