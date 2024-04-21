import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CoursesService } from '@courses/courses.service';
import { Attempt } from '@problems/models/attempts.models';
import { AvailableLanguage, Problem } from '@problems/models/problems.models';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemDifficultyColorPipe } from '@problems/pipes/problem-difficulty-color.pipe';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { ProblemBodyComponent } from '@problems/components/problem-body/problem-body.component';
import { BaseLoadComponent } from '@app/common';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { AttemptLangs } from '@problems/constants';
import { PageResult } from '@app/common/classes/page-result';
import { count, interval, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'part-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    ProblemDifficultyColorPipe,
    MathjaxModule,
    ClipboardModule,
    CodeEditorModule,
    AttemptsTableModule,
    ProblemBodyComponent,
  ]
})
export class ProblemComponent extends BaseLoadComponent<PageResult<Attempt>> implements OnInit, OnChanges {
  @Input() problem: Problem;
  @Input() lessonPartId: number;
  @Output() checkCompletionEvent = new EventEmitter<any>();

  public availableLanguages: AvailableLanguage[] = [];
  public attempts: Attempt[] = [];

  constructor(
    public service: CoursesService,
    public problemsService: ProblemsApiService,
  ) {
    super();
  }

  getData() {
    return this.problemsService.getUserProblemAttempts(
      this.currentUser.username,
      this.problem.id,
      1,
      20,
    );
  }

  afterLoadData(data: PageResult<Attempt>) {
    this.attempts = data.data;
  }

  onSubmitted() {
    this.loadData();
    interval(3000).pipe(take(3)).subscribe(
      () => {
        this.onCheckFinished();
      }
    );
  }

  onCheckFinished() {
    this.service.checkLessonPartCompletion(this.lessonPartId).subscribe(
      (result: any) => {
        this.checkCompletionEvent.emit(result);
      }
    );
  }

  ngOnInit(): void {
    this.availableLanguages = [
      {
        lang: AttemptLangs.PYTHON,
        codeTemplate: this.problem.availableLanguages[0].codeTemplate,
        langFull: 'Python',
        timeLimit: this.problem.availableLanguages[0].timeLimit,
        memoryLimit: this.problem.availableLanguages[0].memoryLimit,
      }
    ];
    setTimeout(() => this.loadData());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('problem' in changes && this.currentUser) {
      this.loadData();
    }
  }
}
