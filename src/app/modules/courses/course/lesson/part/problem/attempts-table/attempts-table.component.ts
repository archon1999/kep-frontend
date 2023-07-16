import { Component, Input, OnInit, ViewChild, TemplateRef, ViewEncapsulation, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Attempt, Verdicts, WSAttempt } from '../../../../../../problems/models/attempts.models';
import { AuthenticationService } from 'app/auth/service';
import { WebsocketService } from 'app/websocket';
import { ApiService } from 'app/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CoreConfigService } from '@core/services/config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'problem-attempts-table',
  templateUrl: './attempts-table.component.html',
  styleUrls: ['./attempts-table.component.scss']
})
export class AttemptsTableComponent implements OnInit, OnDestroy {

  @Input()
  get attempts(): Array<Attempt>{ return this._attempts; }
  set attempts(attempts: Array<Attempt>){
    this.wsService.send('lang-change', this.translationService.getDefaultLang());
    this._attempts = attempts.map((attempt: Attempt) => {
      return Attempt.fromJSON(attempt);
    });
    attempts.forEach((attempt: Attempt) => {
      this.wsService.send('attempt-add', attempt.id);
    });
  }
  private _attempts: Array<Attempt> = [];

  currentUser: any;

  selectedAttempt: Attempt;
  editorOptions = {
    language: 'python',
    theme: 'vs-light',
    readOnly: true,
  };

  @ViewChild('modal') public modalRef: TemplateRef<any>;
  @Output() onCheckFinished = new EventEmitter<any>();

  constructor(
    public authService: AuthenticationService,
    public wsService: WebsocketService,
    public api: ApiService,
    public modalService: NgbModal,
    public toastr: ToastrService,
    public coreConfigService: CoreConfigService,
    public translationService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
    });
  
    this.coreConfigService.getConfig().subscribe((config: any) => {
      if(config.layout.skin == 'dark'){
        this.editorOptions.theme = 'vs-dark';
      } else {
        this.editorOptions.theme = 'vs-light';
      }
    });

    this.wsService.on<WSAttempt>('attempt-update').subscribe((wsAttempt: WSAttempt) => {
      for(var i = 0; i < this.attempts.length; i++){
        if(this.attempts[i].id == wsAttempt.id){
          var attempt = this.attempts[i];
          if(wsAttempt.verdict != Verdicts.Running && wsAttempt.verdict != Verdicts.InQueue){
            this.onCheckFinished.emit({'verdict': wsAttempt.verdict});
          }
          this.attempts[i] = Attempt.fromWSAttempt(attempt, wsAttempt)
        }
      }
    });
  }

  onClick(attemptId){
    this.api.get(`attempts/${attemptId}/`).subscribe((result: any) => {
      this.selectedAttempt = Attempt.fromJSON(result);
      this.editorOptions.language = this.selectedAttempt.getEditorLang();
      this.modalService.open(this.modalRef, {
        centered: true,
        size: 'xl'
      });
    })
  }

  ngOnDestroy() {
    this.attempts.forEach((attempt: Attempt) => {
      this.wsService.send('attempt-delete', attempt.id);
    });
  }
}
