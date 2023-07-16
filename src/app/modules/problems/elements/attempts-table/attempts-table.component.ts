import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'app/api.service';
import { AuthenticationService } from 'app/auth/service';
import { WebsocketService } from 'app/websocket';
import { ToastrService } from 'ngx-toastr';
import { Attempt, Verdicts, WSAttempt } from '../../models/attempts.models';
import { ProblemsService } from '../../problems.service';
import { Contest } from 'app/modules/contests/contests.models';

@Component({
  selector: 'attempts-table',
  templateUrl: './attempts-table.component.html',
  styleUrls: ['./attempts-table.component.scss'],
})
export class AttemptsTableComponent implements OnInit {
  @Input() hideSourceCodeSize = false;
  @Input() contest: Contest;

  @Input()
  get attempts(): Array<Attempt>{ return this._attempts; }
  set attempts(attempts: Array<Attempt>){
    this.wsService.send('lang-change', this.translationService.currentLang);
    this._attempts = attempts.map((attempt: Attempt) => Attempt.fromJSON(attempt));
    attempts.forEach((attempt: Attempt) => this.wsService.send('attempt-add', attempt.id));
  }
  private _attempts: Array<Attempt> = [];

  public currentUser: any;
  public selectedAttempt: Attempt | null;
  public editorOptions = {
    language: 'python',
    theme: 'vs-light',
    readOnly: true,
  };

  @ViewChild('modal') public modalRef: TemplateRef<any>;
  @ViewChild('successAudio') successAudio: ElementRef<any>;
  @ViewChild('wrongAudio') wrongAudio: ElementRef<any>;

  constructor(
    public authService: AuthenticationService,
    public wsService: WebsocketService,
    public api: ApiService,
    public modalService: NgbModal,
    public toastr: ToastrService,
    public coreConfigService: CoreConfigService,
    public translationService: TranslateService,
    public service: ProblemsService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
  
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
          this.attempts[i] = Attempt.fromWSAttempt(attempt, wsAttempt);
          attempt = this.attempts[i];
          if(wsAttempt.verdict == Verdicts.Accepted){
            if(this.attempts[i].canView){
              setTimeout(() => attempt.animationAcceptedState = true, 0);
              this.successAudio.nativeElement.play();
            }
          } else if(wsAttempt.verdict != Verdicts.Running && wsAttempt.verdict != Verdicts.InQueue){
            if(this.attempts[i].canView){
              setTimeout(() => attempt.animationWrongState = true, 0);
              this.wrongAudio.nativeElement.play();
            }
          }
        }
      }
    });
  }

  openModal(attemptId: number){
    this.api.get(`attempts/${attemptId}/`).subscribe((result: any) => {
      this.selectedAttempt = Attempt.fromJSON(result);
      this.editorOptions.language = this.selectedAttempt.getEditorLang();
      this.modalService.open(this.modalRef, {
        centered: true,
        size: 'xl'
      });
    })
  }

  onPurchaseSuccess(attempt: Attempt){
    attempt.canView = true;
  }

  onPurchaseTestSuccess(attempt: Attempt){
    attempt.canTestView = true;
  }

  ngOnDestroy() {
    this.attempts.forEach((attempt: Attempt) => {
      this.wsService.send('attempt-delete', attempt.id);
    });
  }

}
