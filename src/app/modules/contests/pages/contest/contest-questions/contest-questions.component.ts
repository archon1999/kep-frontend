import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ContestsService } from '../../../contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import {
  ContestQuestionCardComponent
} from '@contests/pages/contest/contest-questions/contest-question-card/contest-question-card.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ContestQuestion } from '@contests/models/contest-question';
import { ContestProblem } from '@contests/models/contest-problem';
import { Contest } from '@contests/models/contest';
import { BaseLoadComponent } from '@app/common';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { ContestStatus } from '@contests/constants';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'app-contest-questions',
  templateUrl: './contest-questions.component.html',
  styleUrls: ['./contest-questions.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({duration: 1500}),
    fadeInRightOnEnterAnimation({duration: 1500}),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestQuestionCardComponent,
    NgSelectModule,
    ContestCardModule,
    EmptyResultComponent,
    ContestClassesPipe,
    KepCardComponent,
  ]
})
export class ContestQuestionsComponent extends BaseLoadComponent<ContestQuestion[]> implements OnInit {
  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  public selectedProblem: string;
  public question: string;
  protected readonly ContestStatus = ContestStatus;

  constructor(public service: ContestsService) {
    super();
  }

  get questions() {
    return this.data || [];
  }

  ngOnInit(): void {
    this.route.data.subscribe(({contest, contestProblems}) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblems = contestProblems;
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, {contestTitle: contest.title});
      setTimeout(() => this.loadData());
    });
  }

  submit() {
    this.service.newQuestion(this.contest.id, this.selectedProblem, this.question).subscribe(
      () => {
        this.loadData();
      }
    );
  }

  getData() {
    return this.service.getContestQuestions(this.contest.id);
  }

  protected getContentHeader() {
    return {
      headerTitle: this.contest.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id.toString(),
            isLink: true,
            link: '..'
          },
          {
            name: 'Questions',
            isLink: false,
          },
        ]
      }
    };
  }
}
