import { Component, Input, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Chapter } from '../../testing.models';

@Component({
  selector: 'chapter-card',
  templateUrl: './chapter-card.component.html',
  styleUrls: ['./chapter-card.component.scss'],
  animations: [fadeInOnEnterAnimation({duration: 3000})]
})
export class ChapterCardComponent implements OnInit {

  @Input() chapter: Chapter;

  constructor() { }

  ngOnInit(): void {
  }

}
