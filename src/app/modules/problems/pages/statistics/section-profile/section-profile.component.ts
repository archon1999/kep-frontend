import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Facts,
  GeneralInfo,
  LangInfo,
  TagInfo,
  TopicInfo
} from '@problems/models/statistics.models';
import { getCategoryIcon } from '@problems/utils/category';
import { Resources } from '@app/resources';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { RouterLink } from '@angular/router';

interface TopicView extends TopicInfo {
  icon: string;
}

interface LangView extends LangInfo {
  share: number;
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
    KepIconComponent,
    RouterLink,
  ]
})
export class SectionProfileComponent implements OnChanges {

  @Input() username: string;
  @Input() general: GeneralInfo | null = null;
  @Input() langs: LangInfo[] = [];
  @Input() tags: TagInfo[] = [];
  @Input() topics: TopicInfo[] = [];
  @Input() facts: Facts | null = null;

  public readonly Resources = Resources;

  public languages: LangView[] = [];
  public topicsView: TopicView[] = [];
  public tagsView: TagInfo[] = [];
  public singleAttemptSolved = 0;
  public singleAttemptPercentage = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['langs'] || changes['general']) {
      this.buildLanguages();
    }

    if (changes['topics']) {
      this.buildTopics();
    }

    if (changes['tags']) {
      this.buildTags();
    }

    if (changes['facts']) {
      this.singleAttemptSolved = this.facts?.solvedWithSingleAttempt ?? 0;
      this.singleAttemptPercentage = this.facts?.solvedWithSingleAttemptPercentage ?? 0;
    }
  }

  private buildLanguages() {
    const totalSolved = this.general?.solved ?? 0;
    const sorted = [...(this.langs || [])].sort((a, b) => b.solved - a.solved);
    this.languages = sorted.map((lang) => ({
      ...lang,
      share: totalSolved ? Math.round((lang.solved / totalSolved) * 100) : 0,
    }));
  }

  private buildTopics() {
    this.topicsView = (this.topics || [])
      .map((topic) => ({
        ...topic,
        icon: getCategoryIcon(topic.id),
      }))
      .sort((a, b) => b.solved - a.solved);
  }

  private buildTags() {
    this.tagsView = [...(this.tags || [])]
      .sort((a, b) => b.value - a.value)
      .slice(0, 24);
  }
}
