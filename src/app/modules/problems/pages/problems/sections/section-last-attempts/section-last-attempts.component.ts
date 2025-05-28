import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Attempt } from '@problems/models/attempts.models';
import { Observable } from 'rxjs';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { map } from 'rxjs/operators';
import { PageResult } from '@app/common/classes/page-result';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-last-attempts',
  standalone: true,
  imports: [
    CoreCommonModule,
    ResourceByIdPipe,
    NgbAccordionModule,
    KepCardComponent,
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
