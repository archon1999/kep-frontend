import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CValidators } from '@shared/c-validators/c-validators';
import { AttemptLangs, Verdicts } from '@problems/constants';
import { AvailableLanguage, Problem, SampleTest } from '@problems/models/problems.models';
import { ApiService } from '@core/data-access/api.service';
import { WebsocketService } from '@shared/services/websocket';
import { LanguageService } from '@problems/services/language.service';
import { TemplateCodeService } from '@shared/services/template-code.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { paramsMapper } from '@shared/utils';
import { findAvailableLang } from '@problems/utils';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { AuthService } from '@auth';

interface CheckSamplesResultOne {
  verdict: number;
  input: string;
  output: string;
  answer: string;
}

@Component({
  selector: 'app-problem-workspace',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MonacoEditorComponent,
    NgSelectModule,
    NgbTooltipModule,
    KepcoinSpendSwalModule,
  ],
  templateUrl: './problem-workspace.component.html',
  styleUrls: ['./problem-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemWorkspaceComponent implements OnInit, OnDestroy, OnChanges {
  @Input() submitUrl: string | null = null;
  @Input() submitParams: Record<string, unknown> = {};
  @Input() sampleTests: Array<SampleTest> = [];
  @Input() uniqueName = '';
  @Input() answerForInputEnabled = false;
  @Input() availableLanguages: Array<AvailableLanguage> = [];
  @Input() problem: Problem | null = null;

  @Output() submitted = new EventEmitter<void>();

  public canSubmit = true;
  public isRunning = false;
  public isAnswerForInput = false;
  public isCheckSamples = false;
  public checkSamplesResult: Array<CheckSamplesResultOne> = [];
  public showResultsPanel = false;
  public prevKeyCode: string | null = null;
  public editorHeight = 560;

  public readonly editorForm = new FormGroup({
    code: new FormControl<string>('', [CValidators.maxLength({ value: 65536 })]),
    input: new FormControl<string>('', [CValidators.maxLength({ value: 2048 })]),
    lang: new FormControl<AttemptLangs | null>(null),
    output: new FormControl<string>('', []),
    answer: new FormControl<string>('', []),
    testCaseNumber: new FormControl<number | null>(null),
  });

  protected readonly AttemptLangs = AttemptLangs;
  protected readonly Verdicts = Verdicts;

  private readonly destroy$ = new Subject<void>();
  private initialized = false;

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly wsService: WebsocketService,
    private readonly langService: LanguageService,
    private readonly templateCodeService: TemplateCodeService,
    public readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.updateEditorHeight();
    this.langService.getLanguage().pipe(takeUntil(this.destroy$)).subscribe(
      (lang: AttemptLangs) => {
        this.editorForm.get('lang')?.setValue(lang, { emitEvent: false });
        this.initialized = true;
        this.initEditor();
      }
    );

    this.editorForm.get('code')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      (code: string | null) => {
        const lang = this.editorForm.get('lang')?.value;
        if (!this.uniqueName || !lang) {
          return;
        }
        this.templateCodeService.save(this.uniqueName, lang, code || '');
      }
    );

    this.wsService.on('custom-test-result').pipe(takeUntil(this.destroy$)).subscribe(
      (result: any) => {
        let output = (result.output || '') + (result.error || '');
        output += `\n=========\nTime: ${result.time}ms`;
        output += `\nMemory: ${result.memory}KB`;
        this.isRunning = false;
        this.editorForm.get('output')?.setValue(output);
        this.cdr.markForCheck();
      }
    );

    this.wsService.on('answer-for-input-result').pipe(takeUntil(this.destroy$)).subscribe(
      (result: { answer: string }) => {
        this.editorForm.get('answer')?.setValue('Answer:\n' + result.answer);
        this.isAnswerForInput = false;
        this.cdr.markForCheck();
      }
    );

    this.wsService.on('check-sample-tests-result').pipe(takeUntil(this.destroy$)).subscribe(
      (result: Array<CheckSamplesResultOne>) => {
        this.checkSamplesResult = result;
        this.isCheckSamples = false;
        this.showResultsPanel = true;
        this.cdr.markForCheck();
      }
    );

    this.editorForm.get('testCaseNumber')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      () => this.onSampleTestChange()
    );
  }

  @HostListener('window:resize')
  onResize() {
    this.updateEditorHeight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('availableLanguages' in changes && this.initialized) {
      this.ensureLanguageSelected();
      this.initEditor();
    }

    if ('sampleTests' in changes && this.sampleTests?.length) {
      this.onSampleTestChange();
    }

    if ('problem' in changes) {
      this.ensureLanguageSelected();
      this.initEditor();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  langChange(lang: AttemptLangs) {
    this.langService.setLanguage(lang);
    this.editorForm.get('lang')?.setValue(lang, { emitEvent: false });
    this.initEditor();
  }

  run() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.editorForm.get('output')?.setValue('');
    const data = {
      sourceCode: this.editorForm.get('code')?.value,
      lang: this.editorForm.get('lang')?.value,
      inputData: this.editorForm.get('input')?.value,
    };

    this.api.post('problems/custom-test/', data).subscribe(
      (result: any) => {
        this.wsService.send('custom-test-add', result.id);
      },
      () => {
        this.isRunning = false;
        this.cdr.markForCheck();
      }
    );

    setTimeout(() => {
      this.isRunning = false;
      this.cdr.markForCheck();
    }, 5000);
  }

  submit() {
    if (!this.canSubmit || !this.submitUrl) {
      return;
    }

    this.canSubmit = false;
    const data = {
      sourceCode: this.editorForm.get('code')?.value,
      lang: this.editorForm.get('lang')?.value,
      ...this.submitParams,
    };

    this.api.post(this.submitUrl, data).subscribe(
      () => {
        const text = this.translateService.instant('SubmittedSuccess');
        this.toastr.success('', text);
        this.submitted.emit();
        this.canSubmit = true;
        this.cdr.markForCheck();
      },
      () => {
        this.canSubmit = true;
        this.toastr.error(this.translateService.instant('Error'));
        this.cdr.markForCheck();
      }
    );
  }

  answerForInput(result: { id: number }) {
    if (this.isAnswerForInput) {
      return;
    }
    this.isAnswerForInput = true;
    this.wsService.send('answer-for-input-add', result.id);
    setTimeout(() => {
      this.isAnswerForInput = false;
      this.cdr.markForCheck();
    }, 15000);
  }

  checkSamples() {
    if (this.isCheckSamples || !this.problem) {
      return;
    }
    this.isCheckSamples = true;
    this.showResultsPanel = true;
    const data = {
      lang: this.editorForm.controls.lang.value,
      sourceCode: this.editorForm.controls.code.value,
    };
    this.api.post(`problems/${this.problem.id}/check-sample-tests`, paramsMapper(data)).subscribe(
      (result) => {
        this.wsService.send('check-sample-tests-add', result.id);
      },
      () => {
        this.isCheckSamples = false;
        this.cdr.markForCheck();
      }
    );
    setTimeout(() => {
      this.isCheckSamples = false;
      this.cdr.markForCheck();
    }, 15000);
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.prevKeyCode === 'AltLeft' && event.code === 'Enter') {
      this.submit();
    }
    if (this.prevKeyCode === 'AltLeft' && event.code === 'KeyX') {
      this.run();
    }
    if (this.prevKeyCode === 'AltLeft' && event.code === 'KeyZ') {
      this.checkSamples();
    }
    this.prevKeyCode = event.code;
  }

  closeResultsPanel() {
    this.showResultsPanel = false;
  }

  checkSamplesPurchaseSuccess() {
    if (this.authService.currentUserValue?.permissions) {
      this.authService.currentUserValue.permissions.canUseCheckSamples = true;
    }
  }

  isSelectedLangText() {
    return this.editorForm.get('lang')?.value === AttemptLangs.TEXT;
  }

  trackResult(index: number, item: CheckSamplesResultOne) {
    return `${index}-${item.verdict}-${item.input}`;
  }

  private initEditor() {
    if (!this.availableLanguages?.length) {
      return;
    }

    this.ensureLanguageSelected();
    const editorLang = this.editorForm.get('lang')?.value as AttemptLangs | null;
    if (!editorLang) {
      return;
    }

    const saved = this.templateCodeService.get(this.uniqueName, editorLang);
    const template = findAvailableLang(this.availableLanguages, editorLang)?.codeTemplate
      || this.availableLanguages[0]?.codeTemplate
      || '';

    const currentCode = this.editorForm.get('code')?.value;
    if (!currentCode) {
      this.editorForm.get('code')?.setValue(saved || template, { emitEvent: false });
    } else if (saved && currentCode !== saved) {
      this.editorForm.get('code')?.setValue(saved, { emitEvent: false });
    }

    if (!this.sampleTests?.length) {
      this.editorForm.get('testCaseNumber')?.setValue(null, { emitEvent: false });
    } else if (!this.editorForm.get('testCaseNumber')?.value) {
      this.editorForm.get('testCaseNumber')?.setValue(1, { emitEvent: false });
      this.onSampleTestChange();
    } else {
      this.onSampleTestChange();
    }

    this.cdr.markForCheck();
  }

  private ensureLanguageSelected() {
    if (!this.availableLanguages?.length) {
      return;
    }
    const langControl = this.editorForm.get('lang');
    const current = langControl?.value;
    if (current && findAvailableLang(this.availableLanguages, current)) {
      return;
    }

    const defaultLang = this.availableLanguages[0]?.lang as AttemptLangs | undefined;
    if (defaultLang) {
      langControl?.setValue(defaultLang, { emitEvent: false });
      this.langService.setLanguage(defaultLang);
    }
  }

  private onSampleTestChange() {
    if (!this.sampleTests?.length) {
      return;
    }
    const testCaseNumber = this.editorForm.get('testCaseNumber')?.value;
    if (!testCaseNumber) {
      this.editorForm.get('input')?.setValue('');
      this.editorForm.get('answer')?.setValue('');
      return;
    }

    const sampleTest = this.sampleTests[testCaseNumber - 1];
    if (!sampleTest) {
      return;
    }
    this.editorForm.get('input')?.setValue(sampleTest.input || '');
    this.editorForm.get('answer')?.setValue(sampleTest.output || '');
    this.editorForm.get('output')?.setValue('');
    this.cdr.markForCheck();
  }

  private updateEditorHeight() {
    const reservedSpace = 220;
    this.editorHeight = Math.max(window.innerHeight - reservedSpace, 320);
    this.cdr.markForCheck();
  }
}
