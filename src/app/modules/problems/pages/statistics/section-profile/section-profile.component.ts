import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralInfo } from '@problems/models/statistics.models';
import { getCategoryIcon } from '@problems/utils/category';
import { Resources } from "@app/resources";
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateModule } from '@ngx-translate/core';

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
    KepIconComponent,
    TranslateModule,
  ]
})
export class SectionProfileComponent implements OnChanges {

  @Input() username: string;
  @Input() general: GeneralInfo;
  @Input() langs: Array<LangInfo> = [];
  @Input() tags: Array<TagInfo> = [];
  @Input() topics: Array<TopicInfo> = [];

  public readonly Resources = Resources;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['langs'] && this.langs) {
      this.langs = [...this.langs].sort((a, b) => b.solved - a.solved);
    }

    if (changes['tags'] && this.tags) {
      this.tags = [...this.tags].sort((a, b) => b.value - a.value).slice(0, 10);
    }

    if (changes['topics'] && this.topics) {
      this.topics = this.topics.map((topic) => ({
        ...topic,
        icon: getCategoryIcon(topic.id)
      })).slice(0, 6);
    }
  }
}
