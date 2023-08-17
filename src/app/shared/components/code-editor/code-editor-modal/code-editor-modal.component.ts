import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { getEditorLang } from 'app/modules/problems/utils/editor-lang';
import { AvailableLanguage, SampleTest } from '../../../../modules/problems/models/problems.models';
import { WebsocketService } from '../../../../websocket';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'app/shared/storages/local-storage.service';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { TemplateCodeService } from 'app/shared/services/template-code.service';

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
  @Input() availableLanguages: Array<AvailableLanguage> = [];
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
  ) { }

  ngOnInit(): void {    
    this.langService.getLanguage().subscribe(
      (lang: string) => {
        this.editor.lang = lang;
      }
    )

    this.wsService.on('custom-test-result').subscribe(
      (result: any) => {
        this.editor.output = result.output + result.error;
        this.editor.output += `\n=========\nTime: ${result.time}ms`;
        this.editor.output += `\nMemory: ${result.memory}KB`;
        this.editor.isRunning = false;
      }
    )

    this.coreConfigService.getConfig().subscribe((config: any) => {
      if(config.layout.skin == 'dark'){
        this.editor.options.theme = 'vs-dark';
      } else {
        this.editor.options.theme = 'vs-light';
      }
    });
  }

  getSelectedLangCodeTemplate(){
    for(let availableLanguage of this.availableLanguages){
      if(availableLanguage.lang == this.editor.lang){
        return availableLanguage.codeTemplate;
      }
    }
  }

  onCodeChange(){
    if(this.uniqueName){
      setTimeout(() => {
        this.templateCodeService.save(this.uniqueName, this.editor.lang, this.editor.code);
      }, 100);
    }
  }

  modalOpen(modal) {
    this.hasSubmitted = false;
    this.editor.code = this.templateCodeService.get(this.uniqueName, this.editor.lang) || this.availableLanguages[0].codeTemplate;

    if(this.editor.lang == 'text'){
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

  onSampleTestChange(){
    if(this.sampleTests.length == 0){
      this.editor.testCaseNumber = null;
    } else {
      var sampleTest = this.sampleTests[this.editor.testCaseNumber-1];
      this.editor.input = sampleTest.input;
      this.editor.answer = sampleTest.output;
      this.editor.output = '';
    }
  }

  run(){
    if(this.editor.isRunning) return;
    this.editor.isRunning = true;
    this.editor.output = '';
    var data = {
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

  test(){
    this.editor.isTesting = false;
  }

  addTest(){
    this.sampleTests.push(this.sampleTests[0]);
  }

  submit(){
    this.modalService.dismissAll(0);
    if(this.hasSubmitted) return;
    this.hasSubmitted = true;
    let data = {
      sourceCode: this.editor.code,
      lang: this.editor.lang,
      ...this.submitParams
    };
 
    this.api.post(this.submitUrl, data).subscribe((result: any) => {
      let translations = this.translateService.translations[this.translateService.currentLang];
      let text = translations['SubmittedSuccess']
      this.toastr.success(text);
      this.submittedEvent.emit();
    });
  }

}
