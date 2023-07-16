import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { CourseLessonPartStatus } from 'app/main/courses/courses.models';
import { CoursesService } from 'app/main/courses/courses.service';
import { HighlightLoader } from 'ngx-highlightjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'part-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit, OnChanges {

  @Input() lecture: any;
  @Input() lessonPartId: number;
  @Input() lessonPartStatus: number;
  @Output() checkCompletionEvent = new EventEmitter<any>();

  private _unsubscribeAll = new Subject();

  constructor(
    public service: CoursesService,
    private hljsLoader: HighlightLoader,
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    console.log(this.lecture);
    if(this.lessonPartStatus != CourseLessonPartStatus.COMPLETED){
      this.service.checkLessonPartCompletion(this.lessonPartId).subscribe((result: any) => {
        this.checkCompletionEvent.emit(result);
      });
    }

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        this.hljsLoader.ready.subscribe((result: any) => {
          console.log(result)
        })
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.lessonPartStatus != CourseLessonPartStatus.COMPLETED){
      this.service.checkLessonPartCompletion(this.lessonPartId).subscribe((result: any) => {
        this.checkCompletionEvent.emit(result);
      });
    }
  }
}
