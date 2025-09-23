import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  GeneralInfo,
  LangStatistics,
  TagStatistics,
  TopicStatistics,
} from '@problems/models/statistics.models';
import { getCategoryIcon } from '@problems/utils/category';
import { Resources } from "@app/resources";

@Component({
  selector: 'section-profile',
  templateUrl: './section-profile.component.html',
  styleUrls: ['./section-profile.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
  ]
})
export class SectionProfileComponent {

  @Input() username: string;

  @Input() set general(value: GeneralInfo) {
    this._general = value ?? this._general;
  }

  get general() {
    return this._general;
  }

  @Input() set langs(value: LangStatistics[]) {
    this._langs = [...(value ?? [])].sort((a, b) => b.solved - a.solved);
  }

  get langs() {
    return this._langs;
  }

  @Input() set tags(value: TagStatistics[]) {
    this._tags = [...(value ?? [])].sort((a, b) => b.value - a.value);
  }

  get tags() {
    return this._tags;
  }

  @Input() set topics(value: TopicStatistics[]) {
    this._topics = (value ?? []).map((topic) => ({
      ...topic,
      icon: getCategoryIcon(topic.id),
    }));
  }

  get topics() {
    return this._topics;
  }

  public readonly Resources = Resources;

  private _general: GeneralInfo = {
    solved: 0,
    rating: 0,
    rank: 0,
    usersCount: 0,
  };

  private _langs: LangStatistics[] = [];
  private _tags: TagStatistics[] = [];
  private _topics: Array<TopicStatistics & { icon: string }> = [];
}
