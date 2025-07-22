import { Component } from '@angular/core';
import { BaseLoadComponent } from '@core/common/classes/base-load.component';
import { Observable } from 'rxjs';
import { ChallengesApiService } from '@challenges/services';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { ChallengesRankColorPipe } from '@challenges/pipes/challenges-rank-color.pipe';
import { CoreCommonModule } from '@core/common.module';
import { PageResult } from '@core/common/classes/page-result';
import { ChallengesRating } from '@challenges/interfaces/challenges-rating';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-top-rating',
  standalone: true,
  imports: [CoreCommonModule, ChallengesUserViewComponent, ChallengesRankColorPipe, KepCardComponent],
  templateUrl: './section-top-rating.component.html',
  styleUrl: './section-top-rating.component.scss'
})
export class SectionTopRatingComponent extends BaseLoadComponent<PageResult<ChallengesRating>> {
  constructor(public service: ChallengesApiService) {
    super();
  }

  get challengesRatingList() {
    return this.data?.data;
  }

  getData(): Observable<PageResult<ChallengesRating>> | null {
    return this.service.getChallengesRating({
      page: 1,
      pageSize: 10,
    });
  }
}
