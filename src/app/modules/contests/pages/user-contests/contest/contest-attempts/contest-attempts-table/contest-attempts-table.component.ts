import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { bounceAnimation, shakeAnimation } from 'angular-animations';
import { ApiService } from 'app/api.service';
import { AuthenticationService } from 'app/auth/service';
import { Attempt, Verdicts, WSAttempt } from '../../../../../../problems/attempts.models';
import { WebsocketService } from 'app/websocket';
import { ToastrService } from 'ngx-toastr';
import { Contest } from '../../../user-contests.models';

@Component({
  selector: 'contest-attempts-table',
  templateUrl: './contest-attempts-table.component.html',
  styleUrls: ['./contest-attempts-table.component.scss'],
  animations: [bounceAnimation({ duration: 2000 }), shakeAnimation({ duration: 2000 })]
})
export class ContestAttemptsTableComponent implements OnInit {

  @Input() contest: Contest;

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

  @Output() checkFinishEvent = new EventEmitter<null>();

  currentUser: any;

  selectedAttempt: Attempt;
  editorOptions = {
    language: 'python',
    theme: 'vs-light',
    readOnly: true,
  };

  @ViewChild('modal') public modalRef: TemplateRef<any>;

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
          if(wsAttempt.verdict != Verdicts.InQueue && wsAttempt.verdict != Verdicts.Running){
            this.checkFinish();
          }
          this.attempts[i] = Attempt.fromWSAttempt(attempt, wsAttempt);
          attempt = this.attempts[i];
          if(wsAttempt.verdict == Verdicts.Accepted){
            setTimeout(() => {              
              attempt.animationAcceptedState = true;
            }, 0);
          } else if(wsAttempt.verdict != Verdicts.Running && wsAttempt.verdict != Verdicts.InQueue){
            setTimeout(() => {              
              attempt.animationWrongState = true;
            }, 0);
          }
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

  checkFinish(){
    this.checkFinishEvent.emit();
  }

  ngOnDestroy() {
    this.attempts.forEach((attempt: Attempt) => {
      this.wsService.send('attempt-delete', attempt.id);
    });
  }

}