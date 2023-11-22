import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

interface General {
  solved: number;
  rating: number;
  rank: number;
  usersCount: number;
}

interface LangInfo {
  lang: string;
  langFull: string;
  solved: number;
}

interface TagInfo {
  name: string;
  value: number;
}

interface TopicInfo {
  topic: string;
  solved: number;
}

@Component({
  selector: 'section-profile',
  templateUrl: './section-profile.component.html',
  styleUrls: ['./section-profile.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInOnEnterAnimation({ duration: 3000 }),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
  ]
})
export class SectionProfileComponent implements OnInit {

  @Input() username: string;

  public general: General = {
    solved: 0,
    rating: 0,
    rank: 0,
    usersCount: 0,
  };

  public langs: Array<LangInfo> = [];
  public tags: Array<TagInfo> = [];
  public topics: Array<TopicInfo> = [];

  constructor(
    public authService: AuthenticationService,
    public statisticsService: ProblemsStatisticsService,
  ) {
  }

  ngOnInit(): void {
    this.statisticsService.getGeneral(this.username).subscribe(
      (general: General) => {
        this.general = general;
      }
    );

    this.statisticsService.getByLang(this.username).subscribe(
      (langs: Array<LangInfo>) => {
        this.langs = langs.sort((a, b) => b.solved - a.solved);
      }
    );

    this.statisticsService.getByTag(this.username).subscribe(
      (tags: Array<TagInfo>) => {
        this.tags = tags.sort((a, b) => b.value - a.value);
      }
    );

    this.statisticsService.getByTopic(this.username).subscribe(
      (topics: Array<TopicInfo>) => {
        this.topics = topics.sort((a, b) => b.solved - a.solved);
      }
    );
  }

}
