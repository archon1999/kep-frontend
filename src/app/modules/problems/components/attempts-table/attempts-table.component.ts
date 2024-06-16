import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from '@auth';
import { WebsocketService } from 'app/shared/services/websocket';
import { ToastrService } from 'ngx-toastr';
import { Attempt, WSAttempt } from '../../models/attempts.models';
import { AttemptLangs, Verdicts } from '../../constants';
import { ProblemsApiService } from '../../services/problems-api.service';
import { SoundsService } from 'app/shared/services/sounds/sounds.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/common/classes/base.component';
import { Contest } from '@contests/models/contest';

const LANG_CHANGE_EVENT = 'lang-change';
const ATTEMPT_ADD_EVENT = 'attempt-add';
const ATTEMPT_DELETE_EVENT = 'attempt-delete';

@Component({
  selector: 'attempts-table',
  templateUrl: './attempts-table.component.html',
  styleUrls: ['./attempts-table.component.scss'],
})
export class AttemptsTableComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() hideSourceCodeSize = false;
  @Input() contest: Contest;
  @Input() hackEnabled = false;
  @Output() hackSubmitted = new EventEmitter<null>;
  @Output() checkFinished = new EventEmitter<Attempt>;
  public currentUser: any;
  public selectedAttempt: Attempt | null;
  public editorOptions = {
    language: 'python',
    theme: 'vs-light',
    readOnly: true,
  };
  public hackForm = new FormGroup({
    input: new FormControl(''),
    generatorSource: new FormControl(''),
    generatorLang: new FormControl('py'),
  });
  public successSoundName = this.soundsService.getSuccessSound();
  @ViewChild('modal') public modalRef: TemplateRef<any>;
  @ViewChild('successAudio') successAudio: ElementRef;
  @ViewChild('wrongAudio') wrongAudio: ElementRef;
  public hackAvailableLanguages = [
    AttemptLangs.PYTHON,
    AttemptLangs.CPP,
    AttemptLangs.C,
    AttemptLangs.JAVA,
    AttemptLangs.JS,
    AttemptLangs.KOTLIN,
    AttemptLangs.RUST,
    AttemptLangs.HASKELL,
    AttemptLangs.R,
  ];

  constructor(
    public authService: AuthService,
    public wsService: WebsocketService,
    public api: ApiService,
    public modalService: NgbModal,
    public toastr: ToastrService,
    public coreConfigService: CoreConfigService,
    public translationService: TranslateService,
    public service: ProblemsApiService,
    public soundsService: SoundsService,
  ) {
    super();
  }

  private _attempts: Array<Attempt> = [];

  @Input() get attempts(): Array<Attempt> {
    return this._attempts;
  }

  set attempts(attempts: Array<Attempt>) {
    this.wsService.send(LANG_CHANGE_EVENT, this.translationService.currentLang);
    this.removeAttemptsFromWS();
    this._attempts = attempts.map(attempt => Attempt.fromJSON(attempt));
    this.addAttemptsToWS();
  }

  ngOnInit(): void {
    this.wsService.on<WSAttempt>('attempt-update').subscribe(
      (wsAttempt: WSAttempt) => {
        for (let i = 0; i < this.attempts.length; i++) {
          if (this.attempts[i].id === wsAttempt.id) {
            let attempt = this.attempts[i];
            this.attempts[i] = Attempt.fromWSAttempt(attempt, wsAttempt);
            attempt = this.attempts[i];
            if (wsAttempt.verdict === Verdicts.Accepted) {
              if (this.attempts[i].canView) {
                setTimeout(() => attempt.animationAcceptedState = true, 0);
                this.successAudio?.nativeElement?.play();
              }
              this.checkFinished.next(attempt);
            } else if (wsAttempt.verdict !== Verdicts.Running && wsAttempt.verdict !== Verdicts.InQueue) {
              if (this.attempts[i].canView) {
                setTimeout(() => attempt.animationWrongState = true, 0);
                this.wrongAudio.nativeElement.play();
              }
              this.checkFinished.next(attempt);
            }
          }
        }
      }
    );
  }

  openModal(attemptId: number) {
    this.service.getAttempt(attemptId).subscribe(
      (attempt: Attempt) => {
        this.selectedAttempt = attempt;
        this.editorOptions.language = this.selectedAttempt.getEditorLang();
        this.modalService.open(this.modalRef, {
          centered: true,
          size: 'xl'
        });
      }
    );
  }

  hackSubmit(attemptId: number | string) {
    this.service.hackSubmit(attemptId, this.hackForm.value).subscribe(
      () => {
        this.modalService.dismissAll();
        this.hackSubmitted.next(null);
      }
    );
  }

  addAttemptsToWS() {
    this._attempts.forEach(attempt => this.wsService.send(ATTEMPT_ADD_EVENT, attempt.id));
  }

  removeAttemptsFromWS() {
    this.attempts.forEach((attempt: Attempt) => this.wsService.send(ATTEMPT_DELETE_EVENT, attempt.id));
  }

  ngOnDestroy() {
    this.removeAttemptsFromWS();
  }

}
