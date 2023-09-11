import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { TemplateCodeService } from 'app/shared/services/template-code.service';
import { LocalStorageService } from 'app/shared/storages/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { AvailableLanguage, Problem, SampleTest } from '../../../../modules/problems/models/problems.models';
import { ApiService } from '../../../services/api.service';
import { WebsocketService } from '../../../services/websocket';

@Component({
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

  public editor = {
    options: {
      theme: 'vs-light',
      language: 'python',
    },
    input: '',
    output: '',
    answer: '',
    testCaseNumber: 1,
    lang: 'py',
    code: '',
    isRunning: false,
    isAnswerForInput: false,
    isTesting: false,
  };

  public codeSaveName: string;

  @ViewChild('modal') public modalRef: TemplateRef<any>;

  constructor(
    public api: ApiService,
    public modalService: NgbModal,
    public coreConfigService: CoreConfigService,
    public toastr: ToastrService,
    public translateService: TranslateService,
    public wsService: WebsocketService,
    public localStorageService: LocalStorageService,
    public langService: LanguageService,
    public templateCodeService: TemplateCodeService,
  ) {
  }

  ngOnInit(): void {
    this.langService.getLanguage().subscribe(
      (lang: string) => {
        this.editor.lang = lang;
      }
    );

    this.wsService.on('custom-test-result').subscribe(
      (result: any) => {
        this.editor.output = result.output + result.error;
        this.editor.output += `\n=========\nTime: ${ result.time }ms`;
        this.editor.output += `\nMemory: ${ result.memory }KB`;
        this.editor.isRunning = false;
      }
    );

    this.wsService.on('answer-for-input-result').subscribe(
      (result: any) => {
        this.editor.answer = 'Answer:\n' + result.answer;
        this.editor.isAnswerForInput = false;
      }
    );

    this.coreConfigService.getConfig().subscribe((config: any) => {
      if (config.layout.skin === 'dark') {
        this.editor.options.theme = 'vs-dark';
      } else {
        this.editor.options.theme = 'vs-light';
      }
    });
  }

  onCodeChange() {
    if (this.uniqueName) {
      setTimeout(() => {
        this.templateCodeService.save(this.uniqueName, this.editor.lang, this.editor.code);
      }, 100);
    }
  }

  modalOpen(modal) {
    this.hasSubmitted = false;
    this.editor.code = this.templateCodeService.get(this.uniqueName, this.editor.lang) || this.availableLanguages[0].codeTemplate;

    if (this.editor.lang === 'text') {
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
      this.editor.testCaseNumber = null;
    } else {
      const sampleTest = this.sampleTests[this.editor.testCaseNumber - 1];
      this.editor.input = sampleTest.input;
      this.editor.answer = sampleTest.output;
      this.editor.output = '';
    }
  }

  run() {
    if (this.editor.isRunning) {
      return;
    }
    this.editor.isRunning = true;
    this.editor.output = '';
    const data = {
      sourceCode: this.editor.code,
      lang: this.editor.lang,
      inputData: this.editor.input,
    };
    this.api.post('problems/custom-test/', data).subscribe(
      (result: any) => {
        this.wsService.send('custom-test-add', result.id);
      }
    );
    setTimeout(() => {
      this.editor.isRunning = false;
    }, 5000);
  }

  answerForInput(result) {
    if (this.editor.isAnswerForInput) {
      return;
    }
    this.editor.isAnswerForInput = true;
    this.wsService.send('answer-for-input-add', result.id);
    setTimeout(() => {
      this.editor.isAnswerForInput = false;
    }, 15000);
  }

  addTest() {
    this.sampleTests.push(this.sampleTests[0]);
  }

  submit() {
    this.modalService.dismissAll(0);
    if (this.hasSubmitted) {
      return;
    }
    this.hasSubmitted = true;
    const data = {
      sourceCode: this.editor.code,
      lang: this.editor.lang,
      ...this.submitParams
    };

    this.api.post(this.submitUrl, data).subscribe((result: any) => {
      const translations = this.translateService.translations[this.translateService.currentLang];
      const text = translations['SubmittedSuccess'];
      this.toastr.success(text);
      this.submittedEvent.emit();
    });
  }

}
