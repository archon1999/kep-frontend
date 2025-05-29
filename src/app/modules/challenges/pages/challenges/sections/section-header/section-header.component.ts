import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Observable } from 'rxjs';
import { AuthUser } from '@auth';
import { ChallengesStatisticsService } from '@challenges/services';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ChallengesUserViewComponent
} from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { ChallengesRating } from '@challenges/interfaces/challenges-rating';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ChallengesUserViewComponent,
    ContentHeaderModule,
    NgxSkeletonLoaderModule,
    KepCardComponent,
  ],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SectionHeaderComponent extends BaseLoadComponent<ChallengesRating> {
  @Input() override contentHeader: ContentHeader;
  protected readonly Math = Math;
  override loadOnInit = false;

  constructor(public statisticsService: ChallengesStatisticsService) {
    super();
  }

  override ngOnInit() {}

  get challengesRating() {
    return this.data;
  }

  afterChangeCurrentUser(currentUser: AuthUser) {
    if (currentUser) {
      setTimeout(() => this.loadData());
    }
  }

  getData(): Observable<ChallengesRating> | null {
    return this.statisticsService.getUserChallengesRating(this.currentUser?.username);
  }

  afterLoadData(data: ChallengesRating) {
    data.all = (data.wins + data.draws + data.losses) || 1;
  }
}
