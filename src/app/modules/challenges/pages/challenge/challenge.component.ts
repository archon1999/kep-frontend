import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Challenge } from '@challenges/models';
import { ChallengesApiService } from '@challenges/services';
import Swal from 'sweetalert2';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { tap } from 'rxjs/operators';
import { DragulaModule } from 'ng2-dragula';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { CoreCommonModule } from '@core/common.module';
import { SweetAlertModule } from '@shared/third-part-modules/sweet-alert/sweet-alert.module';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ChallengeResultsCardComponent } from '@challenges/components/challenge-results-card/challenge-results-card.component';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { getResourceById, Resources } from '@app/resources';
import { ChallengeQuestionTimeType, ChallengeStatus } from '@challenges/constants';
import { QuestionCardComponent } from '@challenges/pages/challenge/question-card/question-card.component';
import { ChallengeCountdownComponent } from '@challenges/pages/challenge/challenge-countdown/challenge-countdown.component';
import { BaseComponent } from '@app/common';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    SweetAlertModule,
    ChallengesUserViewComponent,
    NgbTooltipModule,
    CountdownComponent,
    MathjaxModule,
    DragulaModule,
    ChallengeResultsCardComponent,
    MonacoEditorComponent,
    QuestionCardComponent,
    ChallengeCountdownComponent,
  ]
})
export class ChallengeComponent extends BaseComponent implements OnInit, OnDestroy {
  public challenge: Challenge;
  public question: any;
  public isFinish: boolean;

  @ViewChild('startSwal') startSwal: SwalComponent;
  @ViewChild('finishSwal') finishSwal: SwalComponent;
  @ViewChild('counter') counter: ChallengeCountdownComponent;
  @ViewChild('questionCard') questionCard: QuestionCardComponent;
  @ViewChild('successAudio') successAudio: any;
  @ViewChild('wrongAudio') wrongAudio: any;

  protected readonly ChallengeStatus = ChallengeStatus;

  constructor(
    public service: ChallengesApiService,
    public readonly swalTargets: SwalPortalTargets,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.service.getChallenge(params.id).subscribe(
          (challenge) => {
            this.challenge = Challenge.fromJSON(challenge);
            this.titleService.updateTitle(this.route, {
              playerFirstUsername: challenge.playerFirst.username,
              playerSecondUsername: challenge.playerSecond.username,
            });
            this.updateStatus(true);
          }
        );
      }
    );
  }

  updateStatus(firstLoad = false) {
    if (firstLoad &&
      this.challenge.nextQuestion?.number &&
      this.challenge.questionTimeType === ChallengeQuestionTimeType.TimeToAll) {
      if (this.challenge.questionTimeType === ChallengeQuestionTimeType.TimeToAll) {
        this.isFinish = true;
      }
      this.service.checkAnswer(this.challenge.id, {}, this.isFinish).subscribe();
      this.challenge.status = ChallengeStatus.Finished;
      this.finishSweet();
    } else if (this.challenge.finished || this.challenge.nextQuestion.number > this.challenge.questionsCount) {
      this.challenge.status = ChallengeStatus.Finished;
      this.finishSweet();
    } else if (this.challenge.nextQuestion.number === 0) {
      this.challenge.status = ChallengeStatus.NotStarted;
      this.startSweet();
    } else {
      this.challenge.status = ChallengeStatus.Already;
      this.updateQuestion();
    }
  }

  updateQuestion() {
    this.challenge.nextQuestion.question.number = this.challenge.nextQuestion.number;
    this.question = this.challenge.nextQuestion.question;
  }

  startSweet() {
    setTimeout(() => {
      this.startSwal.fire().then(() => {
        this.challengeStart();
      });
    }, 100);
  }

  finishSweet() {
    setTimeout(() => {
      this.finishSwal.fire().then(() => {
        this.route.queryParams.subscribe(
          (params: any) => {
            const arenaId = params['arena'];
            if (arenaId) {
              this.router.navigate([getResourceById(Resources.ArenaTournament, arenaId)]);
            } else {
              this.router.navigateByUrl(Resources.Challenges);
            }
          }
        );
      });
    }, 100);
  }

  challengeStart() {
    this.service.challengeStart(this.challenge.id).subscribe(
      () => {
        this.challengeUpdate().subscribe();
      }
    );
  }

  challengeUpdate() {
    return this.service.getChallenge(this.challenge.id).pipe(
      tap((challenge: Challenge) => {
        this.challenge = Challenge.fromJSON(challenge);
        this.updateStatus();
      })
    );
  }

  checkAnswer(answer: any) {
    this.counter.pause();
    this.service.checkAnswer(this.challenge.id, answer, this.isFinish).subscribe(
      (result: any) => {
        this.counter.start();
        let title: string, icon;
        if (result.success) {
          title = this.translateService.instant('ChallengeQuestionRight');
          icon = 'success';
          this.successAudio.nativeElement.play();
        } else {
          title = this.translateService.instant('ChallengeQuestionWrong');
          icon = 'error';
          this.wrongAudio.nativeElement.play();
        }
        Swal.fire({
          title: title,
          icon: icon,
        }).then(() => {
          this.challengeUpdate().subscribe(
            () => {
              if (this.challenge.questionTimeType === ChallengeQuestionTimeType.TimeToOne) {
                this.counter.reset();
                this.counter.start();
              } else {
                this.counter.start();
              }
            }
          );
        });
      }
    );
  }

  countdownFinish() {
    if (this.challenge.questionTimeType === ChallengeQuestionTimeType.TimeToAll) {
      this.isFinish = true;
    }
    this.questionCard.checkAnswer();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(): void {
    if (this.challenge.nextQuestion?.question && this.challenge.status !== ChallengeStatus.Finished) {
      Swal.fire({
        title: this.translateService.instant('ChallengeBlurError'),
        icon: 'error',
      }).then(() => {
        this.challengeUpdate().subscribe(
          () => {
            if (this.challenge.questionTimeType === ChallengeQuestionTimeType.TimeToOne) {
              this.counter.reset();
              this.counter.start();
            } else {
              this.counter.start();
            }
          }
        );
      });
    }
  }
}
