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
import { AvailableLanguage } from '@problems/models/problems.models';
import { AttemptLangs } from '@problems/constants';

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

  public availableLanguages: AvailableLanguage[] = [];
  private _unsubscribeAll = new Subject();

  constructor(
    public service: CoursesService,
    private hljsLoader: HighlightLoader,
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.availableLanguages = [
      {
        lang: AttemptLangs.PYTHON,
        codeTemplate: this.lecture.sourceCode,
        langFull: 'Python',
        timeLimit: 0,
        memoryLimit: 0,
      }
    ];

    if (this.lessonPartStatus !== CourseLessonPartStatus.COMPLETED) {
      this.service.checkLessonPartCompletion(this.lessonPartId).subscribe((result: any) => {
        this.checkCompletionEvent.emit(result);
      });
    }

    this.coreConfigService.getConfig().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (config: CoreConfig) => {
        this.hljsLoader.ready.subscribe((result: any) => {});
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lessonPartStatus !== CourseLessonPartStatus.COMPLETED) {
      this.service.checkLessonPartCompletion(this.lessonPartId).subscribe((result: any) => {
        this.checkCompletionEvent.emit(result);
      });
    }

    if ('lecture' in changes) {
      this.availableLanguages = [
        {
          lang: AttemptLangs.PYTHON,
          codeTemplate: this.lecture.sourceCode,
          langFull: 'Python',
          timeLimit: 0,
          memoryLimit: 0,
        }
      ];
    }
  }
}
