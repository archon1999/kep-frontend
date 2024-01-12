import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Challenge } from '../../models/challenges.models';
import { ChallengesApiService } from '@challenges/services';
import Swal from 'sweetalert2';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfig } from '@core/types';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { TitleService } from '@shared/services/title.service';
import { TranslateService } from '@ngx-translate/core';
import { randomShuffle } from '@shared/utils';
import { randomChoice } from '@shared/utils/random';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { CoreCommonModule } from '@core/common.module';
import { SweetAlertModule } from '@shared/third-part-modules/sweet-alert/sweet-alert.module';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ChallengeResultsCardComponent } from '@challenges/components/challenge-results-card/challenge-results-card.component';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';

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
  ]
})
export class ChallengeComponent implements OnInit, OnDestroy {

  public challenge: Challenge;
  public question: any;

  public status = {
    finished: 3,
    notStarted: 1,
    already: 2,
  };

  public singleRadio = 0;
  public input = '';
  public conformityGroupOne: Array<string>;
  public conformityGroupTwo: Array<string>;
  public orderingList: Array<string>;
  public classificationGroups: any;
  public editorOptions: any;

  @ViewChild('startSwal') startSwal: SwalComponent;
  @ViewChild('finishSwal') finishSwal: SwalComponent;
  @ViewChild('counter') counter: CountdownComponent;
  @ViewChild('successAudio') successAudio: any;
  @ViewChild('wrongAudio') wrongAudio: any;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ChallengesApiService,
    public route: ActivatedRoute,
    public router: Router,
    public readonly swalTargets: SwalPortalTargets,
    public coreConfigService: CoreConfigService,
    private dragulaService: DragulaService,
    public titleService: TitleService,
    public translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.dragulaService.createGroup('handle-list', {
      moves: function (el, container, handle) {
        return handle.classList.contains('handle');
      }
    });

    this.route.data.subscribe(({ challenge }) => {
      this.challenge = Challenge.fromJSON(challenge);
      this.titleService.updateTitle(this.route, {
        playerFirstUsername: challenge.playerFirst.username,
        playerSecondUsername: challenge.playerSecond.username,
      });
      this.updateStatus();
    });

    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: CoreConfig) => {
        if (config.layout.skin === 'dark') {
          this.editorOptions = {
            theme: 'vs-dark',
            language: 'python',
          };
        } else {
          this.editorOptions = {
            theme: 'vs-light',
            language: 'python',
          };
        }
      });
  }

  updateStatus() {
    if (this.challenge.finished || this.challenge.nextQuestion.number > this.challenge.questionsCount) {
      this.challenge.status = this.status.finished;
      this.finishSweet();
    } else if (this.challenge.nextQuestion.number === 0) {
      this.challenge.status = this.status.notStarted;
      this.startSweet();
    } else {
      this.challenge.status = this.status.already;
      this.updateQuestion();
    }
  }

  updateQuestion() {
    this.question = this.challenge.nextQuestion.question;
    this.singleRadio = 0;
    this.input = '';
    if (this.question.type <= 2) {
      this.question.options = randomShuffle(this.question.options);
    } else if (this.question.type === 4) {
      const a = [], b = [];
      for (const option of this.question.options) {
        a.push(option.optionMain);
        b.push(option.optionSecondary);
      }
      this.conformityGroupOne = randomShuffle(a);
      this.conformityGroupTwo = randomShuffle(b);
    } else if (this.question.type === 5) {
      this.orderingList = [];
      for (const option of this.question.options) {
        this.orderingList.push(option.option);
      }
      this.orderingList = randomShuffle(this.orderingList);
    } else if (this.question.type === 6) {
      const classificationGroups = new Map<string, Array<string>>();
      const keys = [];
      this.classificationGroups = [];
      for (const option of this.question.options) {
        keys.push(option.optionMain);
        classificationGroups.set(option.optionMain, []);
      }
      for (const option of this.question.options) {
        const randomKey = randomChoice(keys);
        const arr = classificationGroups.get(randomKey);
        arr.push(option.optionSecondary);
        classificationGroups.set(randomKey, arr);
      }

      for (const key of classificationGroups.keys()) {
        const values = classificationGroups.get(key);
        this.classificationGroups.push({
          key: key,
          values: values,
        });
      }
    }
  }

  startSweet() {
    setTimeout(() => {
      this.startSwal.fire().then((result) => {
        this.challengeStart();
      });
    }, 100);
  }

  finishSweet() {
    setTimeout(() => {
      this.finishSwal.fire().then((result) => {
        this.route.queryParams.subscribe(
          (params: any) => {
            const arenaId = params['arena'];
            if (arenaId) {
              this.router.navigate(['/competitions', 'arena', 'tournament', arenaId]);
            } else {
              this.router.navigateByUrl('/practice/challenges');
            }
          }
        );
      });
    }, 100);
  }

  challengeStart() {
    this.service.challengeStart(this.challenge.id).subscribe(
      (result: any) => {
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

  checkAnswer() {
    let data: any;
    if (this.question.type === 1) {
      data = [this.singleRadio];
    } else if (this.question.type === 2) {
      data = [];
      for (const option of this.question.options) {
        if (option.selected) {
          data.push(option.id);
        }
      }
    } else if (this.question.type === 3) {
      data = { input: this.input };
    } else if (this.question.type === 4) {
      data = {
        group_one: this.conformityGroupOne,
        group_two: this.conformityGroupTwo
      };
    } else if (this.question.type === 5) {
      data = { ordering_list: this.orderingList };
    } else if (this.question.type === 6) {
      data = { classification_groups: this.classificationGroups };
    } else if (this.question.type === 7) {
      data = { code: this.input };
    }
    this.service.checkAnswer(this.challenge.id, data).subscribe(
      (result: any) => {
        const translations = this.translateService.translations[this.translateService.currentLang];
        let title: string, icon;
        if (result.success) {
          title = translations['ChallengeQuestionRight'];
          icon = 'success';
          this.successAudio.nativeElement.play();
        } else {
          title = translations['ChallengeQuestionWrong'];
          icon = 'error';
          this.wrongAudio.nativeElement.play();
        }
        Swal.fire({
          title: title,
          icon: icon,
        }).then((result) => {
          this.challengeUpdate().subscribe(
            () => {
              this.counter.reset();
              this.counter.start();
            }
          );
        });
      }
    );
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    if (this.challenge.nextQuestion?.question) {
      const translations = this.translateService.translations[this.translateService.currentLang];
      const title = translations['ChallengeBlurError'];
      Swal.fire({
        title: title,
        icon: 'error',
      }).then((result) => {
        this.challengeUpdate().subscribe(
          () => {
            this.counter.reset();
            this.counter.start();
          }
        );
      });

    }
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('handle-list');
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
