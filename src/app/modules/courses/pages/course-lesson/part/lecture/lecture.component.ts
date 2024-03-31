import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { CoursesService } from '@courses/courses.service';
import { Highlight, HighlightLoader } from 'ngx-highlightjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreCommonModule } from '@core/common.module';
import { CourseLessonPartStatus } from '@courses/constants';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';

@Component({
  selector: 'part-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    MathjaxModule,
    Highlight,
    ClipboardModule,
    CodeEditorModule
  ]
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
    if (this.lessonPartStatus != CourseLessonPartStatus.COMPLETED) {
      this.service.checkLessonPartCompletion(this.lessonPartId).subscribe((result: any) => {
        this.checkCompletionEvent.emit(result);
      });
    }

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        this.hljsLoader.ready.subscribe((result: any) => {
          console.log(result);
        });
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lessonPartStatus != CourseLessonPartStatus.COMPLETED) {
      this.service.checkLessonPartCompletion(this.lessonPartId).subscribe((result: any) => {
        this.checkCompletionEvent.emit(result);
      });
    }
  }
}
