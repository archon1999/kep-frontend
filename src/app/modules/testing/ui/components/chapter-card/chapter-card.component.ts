import { Component, Input } from '@angular/core';
import { Chapter } from '@app/modules/testing/domain';

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
