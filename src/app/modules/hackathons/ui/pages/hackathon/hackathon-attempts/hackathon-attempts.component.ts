import { Component, OnInit } from '@angular/core';
import { ProjectAttemptsRepository } from '@projects/data-access/repositories/project-attempts.repository';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { AttemptsTableComponent } from '@projects/ui/components/project-attempts/attempts-table/attempts-table.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { BaseTablePageComponent } from '@app/common';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { ProjectAttempt } from '@projects/domain/entities';

@Component({
  selector: 'hackathon-attempts',
  templateUrl: './hackathon-attempts.component.html',
  styleUrls: ['./hackathon-attempts.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    AttemptsTableComponent,
    KepPaginationComponent
  ]
})
export class HackathonAttemptsComponent extends BaseTablePageComponent<ProjectAttempt> implements OnInit {
  public hackathonId: number;

  constructor(private repository: ProjectAttemptsRepository) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.hackathonId = p['id'];
      this.loadContentHeader();
      this.reloadPage();
    });
  }

  getPage(): Observable<PageResult<ProjectAttempt>> {
    return this.repository.list({ page: this.pageNumber, hackathon_id: this.hackathonId });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Attempts',
      breadcrumb: {
        type: '',
        links: [
          { name: 'Hackathons', isLink: true, link: '../../..' },
          { name: this.hackathonId + '', isLink: true, link: '..' },
          { name: 'Attempts', isLink: false }
        ]
      }
    };
  }
}
