import { Component, Input } from '@angular/core';
import { Chapter } from '@app/modules/testing/testing.models';
import { BaseUserComponent } from '@app/common';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { CommonModule } from '@angular/common';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'chapter-with-tests-card',
  standalone: true,
  imports: [
    CommonModule,
    KepIconComponent,
    NgbTooltipModule,
    TranslateModule,
    RouterLink,
    ResourceByIdPipe
  ],
  templateUrl: './chapter-with-tests-card.component.html',
  styleUrl: './chapter-with-tests-card.component.scss',
  animations: [fadeInOnEnterAnimation()]
})
export class ChapterWithTestsCardComponent extends BaseUserComponent {
  @Input() chapter: Chapter;
  protected readonly Resources = Resources;
}
