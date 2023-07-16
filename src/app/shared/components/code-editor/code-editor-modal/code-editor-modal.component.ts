import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../../api.service';
import { getEditorLang } from '../../../../modules/problems/models/attempts.models';
import { AvailableLanguage, SampleTest } from '../../../../modules/problems/models/problems.models';
import { WebsocketService } from '../../../../websocket';
import { ToastrService } from 'ngx-toastr';

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
  public submittedText: string;

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
  ) { }

  ngOnInit(): void {    
    this.wsService.on('custom-test-result').subscribe(
      (result: any) => {
        this.editor.output = result.output + result.error;
        this.editor.output += `\n=========\nTime: ${result.time}ms`;
        this.editor.output += `\nMemory: ${result.memory}KB`;
        this.editor.isRunning = false;
      }
    )

    this.translateService.get('SubmittedSuccess').subscribe(
      (text: string) => {
        this.submittedText = text;
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

  ngOnChanges(){
    this.ngOnInit();
  }

  onCodeChange(){
    if(this.uniqueName){
      localStorage.setItem(this.codeSaveName, this.editor.code);
    }
  }

  modalOpen(modal) {
    this.hasSubmitted = false;
    this.editor.lang = localStorage.getItem('problems-selected-lang')||'py';    

    if(this.uniqueName){
      this.editor.code = localStorage.getItem(this.codeSaveName)||this.getSelectedLangCodeTemplate()||'';
    } else {
      this.editor.code = this.getSelectedLangCodeTemplate();
    }

    this.editorLangUpdate();

    let ok = false;
    for(let availableLanguage of this.availableLanguages){
        if(availableLanguage.lang == this.editor.lang){
          ok = true;
          break;
        }
    }

    if(!ok){
      this.editor.lang = this.availableLanguages[0].lang;
      this.editor.options.language = getEditorLang(this.editor.lang);
    }

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

  editorLangUpdate(){
    if(this.uniqueName){
      if(this.codeSaveName){
        localStorage.setItem(this.codeSaveName, this.editor.code); 
      }
      this.codeSaveName = this.uniqueName + 'code-editor-code' + this.editor.lang;
    }

    this.editor.options.language = getEditorLang(this.editor.lang);

    if(this.uniqueName){
      this.editor.code = localStorage.getItem(this.codeSaveName)||this.getSelectedLangCodeTemplate()||'';
    } else {
      this.editor.code = this.getSelectedLangCodeTemplate();
    }
  }

  changeLang(lang: string){
    this.editor.lang = lang;
    this.editorLangUpdate();
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
    this.api.post('problems/custom-test/', data).subscribe((result: any) => {
      this.wsService.send('custom-test-add', result.id);
    });
  }

  test(){
    this.editor.isTesting = false;
  }

  addTest(){
    this.sampleTests.push(this.sampleTests[0]);
  }

  submit(){
    if(this.hasSubmitted) return;
    this.hasSubmitted = true;
    this.modalService.dismissAll(0);
    let data = {
      sourceCode: this.editor.code,
      lang: this.editor.lang,
      ...this.submitParams
    };
 
    this.api.post(this.submitUrl, data).subscribe((result: any) => {
      this.toastr.success(this.submittedText);
      this.submittedEvent.emit();
    });
  }

}
