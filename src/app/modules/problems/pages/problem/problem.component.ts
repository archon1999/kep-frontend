import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ShepherdService } from 'angular-shepherd';
import { User } from 'app/auth/models';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { ProblemsService } from '../../services/problems.service';
import { Location } from '@angular/common';
import { ApiService } from '@shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '@shared/components/classes/base.component';
import { CoreSidebarService } from '../../../../../@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 1500 }),
    fadeInRightOnEnterAnimation({ duration: 1000 }),
  ],
})
export class ProblemComponent extends BaseComponent implements OnInit {
  public contentHeader: ContentHeader;

  public problem: Problem;

  public activeId = 1;
  public studyPlanId: number;
  public contestId: number;

  public submitEvent = new Subject();

  public checkInput = '';

  constructor(
    public route: ActivatedRoute,
    public service: ProblemsService,
    public titleService: TitleService,
    public translateService: TranslateService,
    public router: Router,
    public location: Location,
    public api: ApiService,
    public toastr: ToastrService,
    public coreSidebarService: CoreSidebarService,
  ) {
    super();
    if (this.router.url.endsWith('hacks')) {
      this.activeId = 3;
    } else if (this.router.url.endsWith('attempts')) {
      this.activeId = 2;
    }
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ problem }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.checkInput = this.problem.checkInputSource;
      this.loadContentHeader();
    });

    super.ngOnInit();
  }

  afterFirstChangeQueryParams(params: Params) {
    if (params['study-plan']) {
      this.studyPlanId = params['study-plan'];
    }
    if (params['contest']) {
      this.contestId = params['contest'];
    }
  }

  beforeChangeCurrentUser(currentUser: User) {
    if (currentUser !== this.currentUser) {
      this.service.getProblem(this.problem.id).subscribe(
        (problem: Problem) => {
          this.problem = problem;
        }
      );
    }
  }

  loadContentHeader() {
    this.contentHeader = {
      headerTitle: this.problem.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Problems',
            isLink: true,
            link: '/practice/problems',
          },
          {
            name: this.problem.id + '',
            isLink: false,
          },
        ]
      }
    };
  }

  activeIdChange(index: number) {
    if (index === 1) {
      this.location.go(`/practice/problems/problem/${this.problem.id}`);
    } else if (index === 2) {
      this.location.go(`/practice/problems/problem/${this.problem.id}/attempts`);
    } else if (index === 3) {
      this.location.go(`/practice/problems/problem/${this.problem.id}/hacks`);
    }
  }

  saveCheckInput() {
    this.api.post(`problems/${this.problem.id}/save-check-input`, { source: this.checkInput }).subscribe(
      () => {
        this.toastr.success('Success');
      }, () => {
        this.toastr.error('Error');
      }
    );
  }

  codeEditorSidebarToggle(){
    this.coreSidebarService.getSidebarRegistry('codeEditorSidebar').toggleOpen();
  }

}
