import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigService } from 'core/services/config.service';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attempt } from '../../models/attempts.models';
import { ProblemsService } from '../../services/problems.service';

@Component({
  selector: 'app-attempt',
  templateUrl: './attempt.component.html',
  styleUrls: ['./attempt.component.scss']
})
export class AttemptComponent implements OnInit {

  public contentHeader =  {
    headerTitle: 'ATTEMPT',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'PROBLEMS',
          isLink: true,
          link: '/practice/problems'
        },
        {
          name: 'ATTEMPTS',
          isLink: true,
          link: '/practice/problems/attempts'
        },
        {
          name: '',
          isLink: false,
        },
      ]
    }
  };

  public attempt: Attempt;

  public editorOptions = {
    language: 'python',
    theme: 'vs-light',
    readOnly: true,
  };

  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public service: ProblemsService,
    public coreConfigService: CoreConfigService,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      let attemptId = params.params['id'];
      this.service.getAttempt(attemptId).subscribe((result: any) => {
        this.attempt = Attempt.fromJSON(result);
        this.contentHeader.breadcrumb.links[2].name = this.attempt.id+"";
        this.titleService.updateTitle(this.route, {
          attemptId: attemptId,
        });
      })
    });

    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: any) => {
        this.editorOptions.language = this.attempt.getEditorLang();
        if(config.layout.skin == 'dark'){
          this.editorOptions.theme = 'vs-dark';
        } else {
          this.editorOptions.theme = 'vs-light';
        }
    });
  }

}
