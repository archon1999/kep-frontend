import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvailableLanguage, Problem, SampleTest } from '@problems/models/problems.models';
import { AttemptLangs, Verdicts } from '@problems/constants';
import { ApiService } from '@core/data-access/api.service';
import { WebsocketService } from '@shared/services/websocket';
import { LanguageService } from '@problems/services/language.service';
import { TemplateCodeService } from '@shared/services/template-code.service';
import { CValidators } from '@shared/c-validators/c-validators';
import { paramsMapper } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { findAvailableLang } from '@problems/utils';
import { AuthService } from '@auth';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { KepcoinSpendSwalComponent } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.component';
import { VerdictShortTitlePipe } from '@problems/pipes/verdict-short-title.pipe';

export interface CheckSamplesResultOne {
  verdict: number;
  input: string;
  output: string;
  answer: string;
}

@Component({
  selector: 'problem-workspace',
  standalone: true,
  templateUrl: './problem-workspace.component.html',
  styleUrls: ['./problem-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CoreCommonModule,
    NgSelectComponent,
    NgOptionComponent,
    MonacoEditorComponent,
    KepcoinSpendSwalComponent,
    VerdictShortTitlePipe,
  ],
})
export class ProblemWorkspaceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() problem: Problem | null = null;
  @Input() uniqueName = '';
  @Input() availableLanguages: Array<AvailableLanguage> = [];
  @Input() sampleTests: Array<SampleTest> = [];
  @Input() submitUrl: string | null = null;
  @Input() submitParams: Record<string, unknown> = {};
  @Input() answerForInputEnabled = false;

  @Output() submitted = new EventEmitter<void>();

  public readonly AttemptLangs = AttemptLangs;
  protected readonly Verdicts = Verdicts;

  public readonly editorForm = new FormGroup({
    code: new FormControl('', [CValidators.maxLength({ value: 65536 })]),
    input: new FormControl('', [CValidators.maxLength({ value: 2048 })]),
    lang: new FormControl<AttemptLangs | ''>(''),
    output: new FormControl(''),
    answer: new FormControl(''),
    testCaseNumber: new FormControl(1),
  });

  public readonly editorOptions = {
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
  } as const;

  public isRunning = false;
  public isSubmitting = false;
  public isCheckSamples = false;
  public isAnswerForInput = false;

  public checkSamplesResult: Array<CheckSamplesResultOne> = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly api: ApiService,
    private readonly wsService: WebsocketService,
    private readonly langService: LanguageService,
    private readonly templateCodeService: TemplateCodeService,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly spinner: NgxSpinnerService,
    public readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.langService.getLanguage().pipe(takeUntil(this.destroy$)).subscribe((lang: AttemptLangs) => {
      if (!lang) {
        return;
      }
      if (this.editorForm.controls.lang.value !== lang) {
        this.editorForm.controls.lang.setValue(lang, { emitEvent: false });
        this.initEditorState();
      }
    });

    this.wsService.on('custom-test-result').pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
      const output = `${result.output ?? ''}${result.error ?? ''}\n=========\nTime: ${result.time}ms\nMemory: ${result.memory}KB`;
      this.editorForm.controls.output.setValue(output);
      this.isRunning = false;
    });

    this.wsService.on('answer-for-input-result').pipe(takeUntil(this.destroy$)).subscribe((result: { answer: string }) => {
      this.editorForm.controls.answer.setValue('Answer:\n' + result.answer);
      this.isAnswerForInput = false;
    });

    this.wsService.on('check-sample-tests-result').pipe(takeUntil(this.destroy$)).subscribe((result: Array<CheckSamplesResultOne>) => {
      this.spinner.hide(this.resultSpinnerName);
      this.checkSamplesResult = result;
      this.isCheckSamples = false;
    });

    this.editorForm.controls.code.valueChanges?.pipe(takeUntil(this.destroy$)).subscribe((code: string) => {
      const lang = this.editorForm.controls.lang.value;
      if (!lang || !this.uniqueName) {
        return;
      }
      this.templateCodeService.save(this.uniqueName, lang, code ?? '');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['availableLanguages'] && this.availableLanguages?.length) || changes['uniqueName']) {
      this.initEditorState();
    }

    if (changes['sampleTests']) {
      this.applySampleTest();
    }
  }

  run(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.editorForm.controls.output.setValue('');

    const data = {
      sourceCode: this.editorForm.controls.code.value,
      lang: this.editorForm.controls.lang.value,
      inputData: this.editorForm.controls.input.value,
    };

    this.api.post('problems/custom-test/', data).subscribe((result: any) => {
      this.wsService.send('custom-test-add', result.id);
    }, () => {
      this.isRunning = false;
    });

    setTimeout(() => {
      this.isRunning = false;
    }, 5000);
  }

  submit(): void {
    if (this.isSubmitting || !this.submitUrl || !this.editorForm.valid) {
      return;
    }
    this.isSubmitting = true;

    const data = {
      sourceCode: this.editorForm.controls.code.value,
      lang: this.editorForm.controls.lang.value,
      ...this.submitParams,
    };

    this.api.post(this.submitUrl, data).subscribe(() => {
      this.isSubmitting = false;
      const text = this.translateService.instant('SubmittedSuccess');
      this.toastr.success('', text);
      this.submitted.emit();
    }, () => {
      this.isSubmitting = false;
      this.toastr.error(this.translateService.instant('Error'));
    });
  }

  answerForInput(result: { id: number }): void {
    if (this.isAnswerForInput) {
      return;
    }
    this.isAnswerForInput = true;
    this.wsService.send('answer-for-input-add', result.id);
    setTimeout(() => {
      this.isAnswerForInput = false;
    }, 15000);
  }

  checkSamples(): void {
    if (this.isCheckSamples || !this.problem) {
      return;
    }
    this.isCheckSamples = true;
    this.spinner.show(this.resultSpinnerName);
    const data = {
      lang: this.editorForm.controls.lang.value,
      sourceCode: this.editorForm.controls.code.value,
    };

    this.api.post(`problems/${this.problem.id}/check-sample-tests`, paramsMapper(data)).subscribe((result) => {
      this.wsService.send('check-sample-tests-add', result.id);
    }, () => {
      this.spinner.hide(this.resultSpinnerName);
      this.isCheckSamples = false;
    });

    setTimeout(() => {
      this.isCheckSamples = false;
    }, 15000);
  }

  langChange(lang: AttemptLangs): void {
    this.langService.setLanguage(lang);
    this.editorForm.controls.lang.setValue(lang, { emitEvent: false });
    this.initEditorState();
  }

  onSampleTestChange(): void {
    this.applySampleTest();
  }

  isSelectedLangText(): boolean {
    return this.editorForm.controls.lang.value === AttemptLangs.TEXT;
  }

  get resultSpinnerName(): string {
    return `${this.uniqueName}-check-samples`;
  }

  private initEditorState(): void {
    if (!this.availableLanguages?.length) {
      return;
    }

    const langControl = this.editorForm.controls.lang;
    let lang = langControl.value as AttemptLangs;
    if (!lang) {
      lang = this.langService.getLanguageValue();
      langControl.setValue(lang, { emitEvent: false });
    }

    const availableLang = findAvailableLang(this.availableLanguages, lang) || this.availableLanguages[0];
    if (!availableLang) {
      return;
    }

    if (availableLang.lang !== langControl.value) {
      langControl.setValue(availableLang.lang as AttemptLangs, { emitEvent: false });
    }

    const code = this.templateCodeService.get(this.uniqueName, availableLang.lang)
      || availableLang.codeTemplate;

    if (code !== undefined && code !== null) {
      this.editorForm.controls.code.setValue(code);
    }

    this.applySampleTest();
  }

  private applySampleTest(): void {
    if (!this.sampleTests?.length) {
      this.editorForm.controls.testCaseNumber.setValue(null, { emitEvent: false });
      return;
    }

    const index = (this.editorForm.controls.testCaseNumber.value ?? 1) - 1;
    const test = this.sampleTests[index] ?? this.sampleTests[0];
    this.editorForm.controls.testCaseNumber.setValue((this.sampleTests.indexOf(test) + 1), { emitEvent: false });
    this.editorForm.controls.input.setValue(test.input ?? '');
    this.editorForm.controls.answer.setValue(test.output ?? '');
    this.editorForm.controls.output.setValue('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
