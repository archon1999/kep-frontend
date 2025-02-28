import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { TitleService } from 'app/shared/services/title.service';
import { Attempt } from '@problems/models/attempts.models';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { CoreCommonModule } from '@core/common.module';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';

@Component({
  selector: 'app-attempt',
  templateUrl: './attempt.component.html',
  styleUrls: ['./attempt.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    AttemptsTableModule,
    ContentHeaderModule,
  ],
})
export class AttemptComponent implements OnInit {

  public contentHeader = {
    headerTitle: 'ATTEMPT',
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Problems',
          isLink: true,
          link: '/practice/problems'
        },
        {
          name: 'Attempts',
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

  constructor(
    public route: ActivatedRoute,
    public service: ProblemsApiService,
    public coreConfigService: CoreConfigService,
    public titleService: TitleService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      const attemptId = params.params['id'];
      this.service.getAttempt(attemptId).subscribe((result: any) => {
        this.attempt = Attempt.fromJSON(result);
        this.contentHeader.breadcrumb.links[2].name = this.attempt.id + '';
        this.titleService.updateTitle(this.route, {
          attemptId: attemptId,
        });
      });
    });
  }

}
