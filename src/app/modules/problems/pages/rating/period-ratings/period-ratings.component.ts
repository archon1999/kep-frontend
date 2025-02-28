import { Component, inject } from '@angular/core';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { BaseLoadComponent } from '@app/common';
import { CurrentProblemsRating } from '@problems/models/rating.models';
import { PeriodRating } from '@problems/interfaces';
import { forkJoin } from 'rxjs';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { map } from 'rxjs/operators';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { KepTableComponent } from "@shared/components/kep-table/kep-table.component";

@Component({
  selector: 'period-ratings',
  standalone: true,
  imports: [
    CoreCommonModule,
    ContestantViewModule,
    KepCardComponent,
    KepTableComponent,
  ],
  templateUrl: './period-ratings.component.html',
  styleUrl: './period-ratings.component.scss'
})
export class PeriodRatingsComponent extends BaseLoadComponent<any> {
  public periodRatings: PeriodRating[] = [
    {
      period: 'today',
      color: 'success',
      data: [],
    },
    {
      period: 'week',
      color: 'info',
      data: [],
    },
    {
      period: 'month',
      color: 'primary',
      data: [],
    },
  ];

  protected service = inject(ProblemsApiService);

  getData() {
    return forkJoin(
      this.periodRatings.map((rating) =>
        this.service.getCurrentProblemsRating(rating.period).pipe(
          map((result: Array<CurrentProblemsRating>) => ({rating, result}))
        )
      )
    );
  }

  afterLoadData(data: any) {
    data.forEach(({rating, result}) => {
      rating.data = result;
    });
  }
}
