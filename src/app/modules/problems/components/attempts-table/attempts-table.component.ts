import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Attempt, WSAttempt } from '../../models/attempts.models';
import { Verdicts } from '../../constants';
import { ProblemsApiService } from '../../services/problems-api.service';
import { SoundsService } from 'app/shared/services/sounds/sounds.service';
import { BaseComponent } from '@core/common/classes/base.component';
import { Contest } from '@contests/models/contest';
import { WebsocketService } from '@shared/services/websocket';
import { AttemptDetailModalComponent } from './attempt-detail-modal/attempt-detail-modal.component';
import { take } from 'rxjs/operators';

const LANG_CHANGE_EVENT = 'lang-change';
const ATTEMPT_ADD_EVENT = 'attempt-add';
const ATTEMPT_DELETE_EVENT = 'attempt-delete';

@Component({
  selector: 'attempts-table',
  templateUrl: './attempts-table.component.html',
  styleUrls: ['./attempts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AttemptsTableComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() hideSourceCodeSize = false;
  @Input() contest: Contest;
  @Input() hackEnabled = false;

  @Output() hackSubmitted = new EventEmitter<null>;
  @Output() checkFinished = new EventEmitter<Attempt>;

  @ViewChild('successAudio') successAudio: ElementRef;
  @ViewChild('wrongAudio') wrongAudio: ElementRef;

  public successSoundName = this.soundsService.getSuccessSound();

  public trigger = true;
  public lastUpdatedAttempt: Attempt;

  constructor(
    public service: ProblemsApiService,
    public soundsService: SoundsService,
    public wsService: WebsocketService,
  ) {
    super();
  }

  private _attempts: Array<Attempt> = [];

  @Input() get attempts(): Array<Attempt> {
    return this._attempts;
  }

  set attempts(attempts: Array<Attempt>) {
    this.wsService.send(LANG_CHANGE_EVENT, this.translateService.currentLang);
    this.removeAttemptsFromWS();
    this._attempts = attempts.map(attempt => Attempt.fromJSON(attempt));
    this.addAttemptsToWS();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.wsService.on<WSAttempt>('attempt-update').subscribe(
      (wsAttempt: WSAttempt) => {
        // if (wsAttempt.verdict === Verdicts.Running && randomInt(1, 3) >= 2) {
        //   return;
        // }
        for (let i = 0; i < this.attempts.length; i++) {
          if (this.attempts[i].id === wsAttempt.id) {
            let attempt = this.attempts[i];
            this.attempts[i] = Attempt.fromWSAttempt(attempt, wsAttempt);
            attempt = this.attempts[i];
            if (wsAttempt.verdict === Verdicts.Accepted) {
              if (this.attempts[i].canView || this.router.url.includes('duel')) {
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
            setTimeout(() => {
              this.trigger = !this.trigger;
              this.cdr.markForCheck();
              this.cdr.detectChanges();
            });
            if (this.isOwner(attempt)) {
              this.lastUpdatedAttempt = attempt;
            }
          }
        }
      }
    );
  }

  openModal(attemptId: number) {
    this.service.getAttempt(attemptId).subscribe(
      (attempt: Attempt) => {
        const modalRef = this.modalService.open(AttemptDetailModalComponent, {
          centered: true,
          animation: null,
          size: 'xl',
        });
        modalRef.componentInstance.attempt = attempt;
        modalRef.componentInstance.contest = this.contest;
        modalRef.componentInstance.hideSourceCodeSize = this.hideSourceCodeSize;
        modalRef.componentInstance.hackEnabled = this.hackEnabled;
        modalRef.componentInstance.hackSubmitted.pipe(take(1)).subscribe(() => {
          this.hackSubmitted.next(null);
        });
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

  isOwner(attempt: Attempt) {
    if (attempt?.user?.username === this.currentUser?.username) {
      return true;
    }
    if (attempt.team && attempt.team.members.filter(member => member.username === this.currentUser?.username).length) {
      return true;
    }
    return false;
  }
}
