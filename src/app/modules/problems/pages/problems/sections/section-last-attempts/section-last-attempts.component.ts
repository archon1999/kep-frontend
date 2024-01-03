import { Component, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@shared/components/classes/base-load.component';
import { Attempt } from '@problems/models/attempts.models';
import { Observable } from 'rxjs';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { map } from 'rxjs/operators';
import { PageResult } from '@shared/components/classes/page-result';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { AttemptVerdictHTMLPipe } from '@problems/pipes/attempt-verdict-html.pipe';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'section-last-attempts',
  standalone: true,
  imports: [
    CoreCommonModule,
    ResourceByIdPipe,
    AttemptVerdictHTMLPipe,
    NgbAccordionModule,
  ],
  templateUrl: './section-last-attempts.component.html',
  styleUrl: './section-last-attempts.component.scss',
})
export class SectionLastAttemptsComponent extends BaseLoadComponent<Attempt[]> {

  constructor(public apiService: ProblemsApiService) {
    super();
  }

  get attempts() {
    return this.data;
  }

  getData(): Observable<Attempt[]> | null {
    return this.apiService.getUserAttempts({
      username: this.currentUser?.username,
      pageSize: 10,
    }).pipe(
      map((pageResult: PageResult<Attempt>) => {
        return pageResult.data;
      })
    );
  }

}
