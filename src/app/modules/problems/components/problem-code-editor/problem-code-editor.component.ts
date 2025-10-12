import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AvailableLanguage, Problem, SampleTest } from '@problems/models/problems.models';
import { AttemptLangs, Verdicts } from '@problems/constants';
import { ApiService } from '@core/data-access/api.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { WebsocketService } from '@shared/services/websocket';
import { LanguageService } from '@problems/services/language.service';
import { TemplateCodeService } from '@shared/services/template-code.service';
import { AuthService } from '@auth';
import { CValidators } from '@shared/c-validators/c-validators';
import { paramsMapper } from '@shared/utils';
import { findAvailableLang } from '@problems/utils';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { VerdictShortTitlePipe } from '@problems/pipes/verdict-short-title.pipe';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

interface CheckSamplesResultOne {
  verdict: number;
  input: string;
  output: string;
  answer: string;
  error?: string;
}

@Component({
  selector: 'problem-code-editor',
  standalone: true,
  imports: [
    CoreCommonModule,
    ReactiveFormsModule,
    KepCardComponent,
    MonacoEditorComponent,
    NgSelectModule,
    TranslateModule,
    NgbTooltipModule,
    KepcoinSpendSwalModule,
    NgbAccordionModule,
    VerdictShortTitlePipe,
    SpinnerComponent,
  ],
  templateUrl: './problem-code-editor.component.html',
  styleUrl: './problem-code-editor.component.scss'
})
export class ProblemCodeEditorComponent implements OnInit, OnChanges {
  @Input() submitUrl: string;
  @Input() submitParams: any = {};
  @Input() sampleTests: Array<SampleTest> = [];
  @Input() uniqueName = 'problem-code-editor';
  @Input() answerForInputEnabled = false;
  @Input() availableLanguages: Array<AvailableLanguage> = [];
  @Input() problem: Problem;

  @Output() submitted = new EventEmitter<void>();

  public canSubmit = true;
  public isRunning = false;
  public isAnswerForInput = false;
  public isCheckSamples = false;
  public showResultsPanel = false;

  public editorForm = new FormGroup({
    code: new FormControl('', [CValidators.maxLength({ value: 65536 })]),
    input: new FormControl('', [CValidators.maxLength({ value: 2048 })]),
    lang: new FormControl('', []),
    output: new FormControl('', []),
    answer: new FormControl('', []),
    testCaseNumber: new FormControl(1),
  });

  public checkSamplesResult: Array<CheckSamplesResultOne> = [];
  public readonly AttemptLangs = AttemptLangs;
  protected readonly Verdicts = Verdicts;

  constructor(
    public api: ApiService,
    public toastr: ToastrService,
    public translateService: TranslateService,
    public wsService: WebsocketService,
    public langService: LanguageService,
    public templateCodeService: TemplateCodeService,
    public authService: AuthService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('availableLanguages' in changes && this.availableLanguages?.length && !this.editorForm.controls.lang.value) {
      this.editorForm.controls.lang.setValue(this.availableLanguages[0].lang, { emitEvent: false });
    }

    if ('sampleTests' in changes) {
      this.onSampleTestChange();
    }
  }

  ngOnInit(): void {
    this.langService.getLanguage().subscribe(
      (lang: AttemptLangs) => {
        if (!this.availableLanguages?.length) {
          return;
        }
        const available = findAvailableLang(this.availableLanguages, lang) || this.availableLanguages[0];
        const targetLang = available?.lang || lang;
        this.editorForm.controls.lang.setValue(targetLang, { emitEvent: false });
        if (available?.lang !== lang) {
          this.langService.setLanguage(targetLang);
        }
        this.init();
      }
    );

    this.wsService.on('custom-test-result').subscribe(
      (result: any) => {
        let output = result.output + result.error;
        output += `\n=========\nTime: ${ result.time }ms`;
        output += `\nMemory: ${ result.memory }KB`;
        this.isRunning = false;
        this.editorForm.controls.output.setValue(output);
      }
    );

    this.wsService.on('answer-for-input-result').subscribe(
      (result: { answer: string }) => {
        this.editorForm.controls.answer.setValue('Answer:\n' + result.answer);
        this.isAnswerForInput = false;
      }
    );

    this.wsService.on('check-sample-tests-result').subscribe(
      (result: Array<CheckSamplesResultOne>) => {
        this.checkSamplesResult = result;
        this.isCheckSamples = false;
        this.showResultsPanel = true;
      }
    );

    this.editorForm.controls.code.valueChanges.subscribe(
      (code: string) => {
        if (!this.uniqueName) {
          return;
        }
        const lang = this.editorForm.controls.lang.value as AttemptLangs;
        if (!lang) {
          return;
        }
        this.templateCodeService.save(this.uniqueName, lang, code || '');
      }
    );
  }

  init(): void {
    if (!this.availableLanguages?.length) {
      return;
    }
    const editorLang = this.editorForm.controls.lang.value as AttemptLangs;
    const stored = this.templateCodeService.get(this.uniqueName, editorLang);
    const fallback = findAvailableLang(this.availableLanguages, editorLang)?.codeTemplate
      || this.availableLanguages[0]?.codeTemplate
      || '';
    this.editorForm.controls.code.setValue(stored || fallback || '', { emitEvent: false });
    if (stored) {
      this.templateCodeService.save(this.uniqueName, editorLang, stored);
    }
    this.onSampleTestChange();
  }

  langChange(lang: AttemptLangs): void {
    this.langService.setLanguage(lang);
    this.init();
  }

  onSampleTestChange(): void {
    if (!this.sampleTests?.length) {
      this.editorForm.controls.testCaseNumber.setValue(null, { emitEvent: false });
      return;
    }
    const testCaseNumber = this.editorForm.controls.testCaseNumber.value || 1;
    const sampleTest = this.sampleTests[testCaseNumber - 1] || this.sampleTests[0];
    this.editorForm.controls.input.setValue(sampleTest?.input || '');
    this.editorForm.controls.answer.setValue(sampleTest?.output || '');
    this.editorForm.controls.output.setValue('');
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

    this.api.post('problems/custom-test/', data).subscribe(
      (result: any) => {
        this.wsService.send('custom-test-add', result.id);
      }
    );

    setTimeout(() => {
      this.isRunning = false;
    }, 5000);
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

  submit(): void {
    if (!this.canSubmit || !this.submitUrl) {
      return;
    }
    this.canSubmit = false;
    const data = {
      sourceCode: this.editorForm.controls.code.value,
      lang: this.editorForm.controls.lang.value,
      ...this.submitParams,
    };

    this.api.post(this.submitUrl, data).subscribe(
      () => {
        const text = this.translateService.instant('SubmittedSuccess');
        this.toastr.success('', text);
        this.submitted.emit();
        this.canSubmit = true;
      },
      () => {
        this.canSubmit = true;
      }
    );
  }

  isSelectedLangText(): boolean {
    return this.editorForm.controls.lang.value === AttemptLangs.TEXT;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.altKey && event.code === 'Enter') {
      event.preventDefault();
      this.submit();
    }
    if (event.altKey && event.code === 'KeyX') {
      event.preventDefault();
      this.run();
    }
    if (event.altKey && event.code === 'KeyZ') {
      event.preventDefault();
      this.checkSamples();
    }
  }

  checkSamplesPurchaseSuccess(): void {
    if (this.authService.currentUserValue?.permissions) {
      this.authService.currentUserValue.permissions.canUseCheckSamples = true;
    }
  }

  checkSamples(): void {
    if (this.isCheckSamples || !this.problem) {
      return;
    }
    this.isCheckSamples = true;
    this.showResultsPanel = true;
    const data = {
      lang: this.editorForm.controls.lang.value,
      sourceCode: this.editorForm.controls.code.value,
    };
    this.api.post(`problems/${ this.problem.id }/check-sample-tests`, paramsMapper(data)).subscribe(
      (result) => {
        this.wsService.send('check-sample-tests-add', result.id);
      },
      () => {
        this.isCheckSamples = false;
      }
    );
    setTimeout(() => this.isCheckSamples = false, 15000);
  }
}
