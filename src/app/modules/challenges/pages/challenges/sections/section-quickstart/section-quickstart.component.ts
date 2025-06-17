import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  NewChallengeButtonComponent
} from '@challenges/components/new-challenge-button/new-challenge-button.component';
import { ChallengesApiService } from '@challenges/services';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { getResourceById, Resources } from '@app/resources';
import { BaseUserComponent } from '@app/common/classes/base-user.component';
import { Router } from '@angular/router';
import { ChallengeCall, NewChallengeCall } from '@challenges/interfaces';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { Chapter } from "@testing/domain";


@Component({
  selector: 'section-quickstart',
  standalone: true,
  imports: [
    CoreCommonModule,
    NewChallengeButtonComponent,
    NgSelectModule,
    NgxSliderModule,
  ],
  templateUrl: './section-quickstart.component.html',
  styleUrl: './section-quickstart.component.scss',
})
export class SectionQuickstartComponent extends BaseUserComponent implements OnInit {
  @Output() newChallengeClick = new EventEmitter<null>();

  public questionSliderOptions: Options = {
    showSelectionBar: true,
    floor: 4,
    ceil: 10,
  };

  public timeSecondsSliderOptions: Options = {
    showSelectionBar: true,
    floor: 10,
    ceil: 90,
    step: 10,
  };

  public quickStarts: Array<NewChallengeCall> = [
    {
      timeSeconds: 60,
      questionsCount: 6,
    },
    {
      timeSeconds: 50,
      questionsCount: 5,
    },
    {
      timeSeconds: 40,
      questionsCount: 5,
    },
    {
      timeSeconds: 30,
      questionsCount: 6,
    }
  ];

  public chapters: Chapter[] = [];
  public newChallengeCall: NewChallengeCall = {
    timeSeconds: 40,
    questionsCount: 6,
    selectedChapters: [],
  };

  constructor(public service: ChallengesApiService, public router: Router) {
    super();
  }

  ngOnInit() {
    this.service.getChapters().subscribe(
      (chapters: Array<Chapter>) => {
        this.chapters = chapters;
      }
    );
  }

  newChallenge(challengeCall: NewChallengeCall) {
    if (!this.currentUser) {
      this.router.navigateByUrl(Resources.Login);
      return;
    }

    this.service.newChallengeCall(
      challengeCall.timeSeconds,
      challengeCall.questionsCount,
      challengeCall.selectedChapters || [],
    ).subscribe(
      () => {
        this.newChallengeClick.emit(null);
      }
    );
  }

  quickStartClick(quickStart: NewChallengeCall) {
    if (!this.currentUser) {
      this.router.navigateByUrl(Resources.Login);
      return;
    }

    this.service.getChallengeCalls().subscribe(
      (challengeCalls: ChallengeCall[]) => {
        for (const challengeCall of challengeCalls) {
          if (challengeCall.timeSeconds === quickStart.timeSeconds && challengeCall.questionsCount === quickStart.questionsCount) {
            if (challengeCall.username !== this.currentUser.username) {
              this.acceptChallengeCall(challengeCall.id);
              return;
            }
          }
        }
        this.newChallenge(quickStart);
      }
    );
  }

  acceptChallengeCall(challengeCallId: number) {
    if (!this.currentUser) {
      this.router.navigateByUrl(Resources.Login);
      return;
    }

    this.service.acceptChallengeCall(challengeCallId).subscribe(
      (result: any) => {
        if (result.success) {
          const challengeId = result.challengeId;
          this.router.navigateByUrl(getResourceById(Resources.Challenge, challengeId));
        }
      }
    );
  }

}
