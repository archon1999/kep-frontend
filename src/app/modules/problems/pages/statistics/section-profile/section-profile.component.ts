import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@auth';
import { ProblemsStatisticsService } from '@problems/services/problems-statistics.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { GeneralInfo } from '@problems/models/statistics.models';
import { getCategoryIcon } from '@problems/utils/category';
import { Resources } from "@app/resources";

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
  code: string;
  id: number;
  icon: string;
}

@Component({
  selector: 'section-profile',
  templateUrl: './section-profile.component.html',
  styleUrls: ['./section-profile.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    KepCardComponent,
  ]
})
export class SectionProfileComponent implements OnInit {

  @Input() username: string;

  public readonly Resources = Resources;

  public general: GeneralInfo = {
    solved: 0,
    rating: 0,
    rank: 0,
    usersCount: 0,
  };

  public langs: Array<LangInfo> = [];
  public tags: Array<TagInfo> = [];
  public topics: Array<TopicInfo> = [];
  public langMaxSolved = 0;
  public topicMaxSolved = 0;

  constructor(
    public authService: AuthService,
    public statisticsService: ProblemsStatisticsService,
  ) {
  }

  ngOnInit(): void {
    this.statisticsService.getGeneral(this.username).subscribe(
      (general: GeneralInfo) => {
        this.general = general;
      }
    );

    this.statisticsService.getByLang(this.username).subscribe(
      (langs: Array<LangInfo>) => {
        this.langs = langs.sort((a, b) => b.solved - a.solved);
        this.langMaxSolved = this.langs.reduce(
          (max, lang) => lang.solved > max ? lang.solved : max,
          0,
        );
      }
    );

    this.statisticsService.getByTag(this.username).subscribe(
      (tags: Array<TagInfo>) => {
        this.tags = tags
          .sort((a, b) => b.value - a.value)
          .slice(0, 18);
      }
    );

    this.statisticsService.getByTopic(this.username).subscribe(
      (topics: Array<TopicInfo>) => {
        this.topics = topics
          .map((topic) => {
            topic.icon = getCategoryIcon(topic.id);
            return topic;
          })
          .sort((a, b) => b.solved - a.solved);

        this.topicMaxSolved = this.topics.reduce(
          (max, topic) => topic.solved > max ? topic.solved : max,
          0,
        );
      }
    );
  }

  public getShare(value: number, max: number): number {
    if (!max || !value) {
      return 0;
    }

    const percent = Math.round((value / max) * 100);

    return Math.min(100, percent);
  }
}
