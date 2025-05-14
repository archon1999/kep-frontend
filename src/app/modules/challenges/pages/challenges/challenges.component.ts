import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { BasePageComponent } from '@app/common/classes/base-page.component';
import { SectionHeaderComponent } from '@challenges/pages/challenges/sections/section-header/section-header.component';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import {
  SectionQuickstartComponent
} from '@challenges/pages/challenges/sections/section-quickstart/section-quickstart.component';
import {
  SectionInQueueComponent
} from '@challenges/pages/challenges/sections/section-in-queue/section-in-queue.component';
import {
  SectionChallengesComponent
} from '@challenges/pages/challenges/sections/section-challenges/section-challenges.component';
import {
  SectionTopRatingComponent
} from '@challenges/pages/challenges/sections/section-top-rating/section-top-rating.component';
import { SectionArenasComponent } from '@challenges/pages/challenges/sections/section-arenas/section-arenas.component';

enum Tab {
  QuickStart = 1,
  InQueue,
  Challenges
}

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    SectionHeaderComponent,
    SectionQuickstartComponent,
    SectionInQueueComponent,
    SectionChallengesComponent,
    SectionTopRatingComponent,
    SectionArenasComponent,
    NgbNavModule,
  ]
})
export class ChallengesComponent extends BasePageComponent implements OnInit, OnDestroy {
  public activeTab = Tab.InQueue;
  protected readonly Tab = Tab;

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Challenges',
      breadcrumb: {
        links: [
          {
            name: 'Practice',
            isLink: false,
          },
          {
            name: 'Challenges',
            isLink: false,
          }
        ]
      }
    };
  }
}
