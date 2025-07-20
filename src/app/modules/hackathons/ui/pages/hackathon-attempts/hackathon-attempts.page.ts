import { Component, Input, OnInit } from '@angular/core';
import { ProjectAttemptsRepository } from '@projects/data-access/repositories/project-attempts.repository';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { AttemptsTableComponent } from '@projects/ui/components/project-attempts/attempts-table/attempts-table.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { BaseTablePageComponent } from '@app/common';
import { interval, Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { ProjectAttempt } from '@projects/domain/entities';
import { Hackathon } from "@hackathons/domain";
import { HackathonTabComponent } from "@hackathons/ui/components/hackathon-tab/hackathon-tab.component";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'hackathon-attempts',
  templateUrl: './hackathon-attempts.page.html',
  styleUrls: ['./hackathon-attempts.page.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    AttemptsTableComponent,
    KepPaginationComponent,
    HackathonTabComponent,
    KepCardComponent
  ]
})
export class HackathonAttemptsPage extends BaseTablePageComponent<ProjectAttempt> implements OnInit {
  @Input() hackathon: Hackathon;

  constructor(private repository: ProjectAttemptsRepository) {
    super();
    this.hackathon = this.route.snapshot.data.hackathon;

    interval(5000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => this.reloadPage()
    )
  }

  getPage(): Observable<PageResult<ProjectAttempt>> {
    return this.repository.list({ page: this.pageNumber, hackathonId: this.hackathon.id });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Attempts',
      breadcrumb: {
        type: '',
        links: [
          { name: 'Hackathons', isLink: true, link: '../../..' },
          { name: this.hackathon.id + '', isLink: true, link: '..' },
          { name: 'Attempts', isLink: false }
        ]
      }
    };
  }
}
