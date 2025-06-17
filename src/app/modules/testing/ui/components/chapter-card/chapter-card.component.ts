import { Component, Input } from '@angular/core';
import { Chapter } from '@app/modules/testing/domain';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'chapter-card',
  templateUrl: './chapter-card.component.html',
  styleUrls: ['./chapter-card.component.scss'],
  imports: [],
  standalone: true,
})
export class ChapterCardComponent {
  @Input() chapter: Chapter;
}
