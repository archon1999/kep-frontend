import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { TemplateCodeService } from 'app/shared/services/template-code.service';
import { ToastrService } from 'ngx-toastr';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { AvailableLanguage, Problem, SampleTest } from '../../../../modules/problems/models/problems.models';
import { ApiService } from '../../../services/api.service';
import { WebsocketService } from '../../../services/websocket';
import { FormControl, FormGroup } from '@angular/forms';
import { CValidators } from '../../../c-validators/c-validators';
import { AttemptLangs } from '../../../../modules/problems/constants';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'code-editor-modal',
  templateUrl: './code-editor-modal.component.html',
  styleUrls: ['./code-editor-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CodeEditorModalComponent implements OnInit {

  @Input() submitUrl: string;
  @Input() submitParams: any = {};
  @Input() sampleTests: Array<SampleTest> = [];
  @Input() uniqueName: string;
  @Input() customClass = '';
  @Input() answerForInputEnabled = false;
  @Input() availableLanguages: Array<AvailableLanguage> = [];
  @Input() problem: Problem;
  @Output() submittedEvent = new EventEmitter<null>();

  public hasSubmitted = false;

  public editorForm = new FormGroup({
    code: new FormControl('', [CValidators.maxLength({ value: 60000 })]),
    input: new FormControl('', [CValidators.maxLength({ value: 1000 })]),
    lang: new FormControl('', []),
    output: new FormControl('', []),
    answer: new FormControl('', []),
    testCaseNumber: new FormControl(1),
  });

  public isRunning = false;
  public isAnswerForInput = false;

  @ViewChild('modal') public modalRef: TemplateRef<any>;

  constructor(
    public api: ApiService,
    public modalService: NgbModal,
    public coreConfigService: CoreConfigService,
    public toastr: ToastrService,
    public translateService: TranslateService,
    public wsService: WebsocketService,
    public langService: LanguageService,
    public templateCodeService: TemplateCodeService,
  ) {
  }

  ngOnInit(): void {
    this.langService.getLanguage().subscribe(
      (lang: string) => {
        this.editorForm.get('lang').setValue(lang);
      }
    );

    this.wsService.on('custom-test-result').subscribe(
      (result: any) => {
        let output = result.output + result.error;
        output += `\n=========\nTime: ${result.time}ms`;
        output += `\nMemory: ${result.memory}KB`;
        this.isRunning = false;
        this.editorForm.get('output').setValue(output);
      }
    );

    this.wsService.on('answer-for-input-result').subscribe(
      (result: { answer: string }) => {
        this.editorForm.get('answer').setValue('Answer:\n' + result.answer);
        this.isAnswerForInput = false;
      }
    );

    this.editorForm.get('code').valueChanges.subscribe(
      (code: string) => {
        this.templateCodeService.save(this.uniqueName, this.editorForm.get('lang').value, code);
      }
    );
  }

  modalOpen(modal: TemplateRef<any>) {
    this.hasSubmitted = false;
    const editorLang = this.editorForm.get('lang').value;
    const code = this.templateCodeService.get(this.uniqueName, editorLang) || this.availableLanguages[0].codeTemplate;
    this.editorForm.get('code').setValue(code);

    if (this.isSelectedLangText()) {
      this.modalService.open(modal, {
        size: 'md',
        centered: true,
      });
    } else {
      this.modalService.open(modal, {
        size: 'xl',
        scrollable: true,
      });
    }
    this.onSampleTestChange();
  }

  onSampleTestChange() {
    if (this.sampleTests.length === 0) {
      this.editorForm.get('testCaseNumber').setValue(null);
    } else {
      const testCaseNumber = this.editorForm.get('testCaseNumber').value;
      const sampleTest = this.sampleTests[testCaseNumber - 1];
      this.editorForm.get('input').setValue(sampleTest.input);
      this.editorForm.get('answer').setValue(sampleTest.output);
      this.editorForm.get('output').setValue('');
    }
  }

  run() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;

    this.editorForm.get('output').setValue('');
    const data = {
      sourceCode: this.editorForm.get('code').value,
      lang: this.editorForm.get('lang').value,
      inputData: this.editorForm.get('input').value,
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

  answerForInput(result: { id: number }) {
    if (this.isAnswerForInput) {
      return;
    }
    this.isAnswerForInput = true;
    this.wsService.send('answer-for-input-add', result.id);
    setTimeout(() => {
      this.isAnswerForInput = false;
    }, 15000);
  }

  submit() {
    this.modalService.dismissAll(0);
    if (this.hasSubmitted) {
      return;
    }
    this.hasSubmitted = true;
    const data = {
      sourceCode: this.editorForm.get('code').value,
      lang: this.editorForm.get('lang').value,
      ...this.submitParams
    };

    this.api.post(this.submitUrl, data).subscribe(
      () => {
        const translations = this.translateService.translations[this.translateService.currentLang];
        const text = translations['SubmittedSuccess'];
        this.toastr.success(text);
        this.submittedEvent.emit();
      }
    );
  }

  isSelectedLangText() {
    return (this.editorForm.get('lang').value === AttemptLangs.TEXT);
  }

}
