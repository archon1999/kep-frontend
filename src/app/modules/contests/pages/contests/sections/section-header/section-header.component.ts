import { Component, Input } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContestsService } from '@contests/contests.service';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { ContestsRating } from '@contests/models';
import { AuthUser } from '@auth';
import { Observable } from 'rxjs';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from "@shared/ui/components/content-header/content-header.module";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@Component({
  selector: 'section-header',
  standalone: true,
  imports: [CoreCommonModule, ContestantViewModule, ContentHeaderModule, KepCardComponent, NgxSkeletonLoaderModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent extends BaseLoadComponent<ContestsRating> {
  @Input() override contentHeader: ContentHeader;

  override loadOnInit = false;

  constructor(public service: ContestsService) {
    super();
  }

  override ngOnInit() {}

  getData(): Observable<ContestsRating> {
    return this.service.getUserContestsRating(this.currentUser?.username);
  }

  afterChangeCurrentUser(currentUser: AuthUser) {
    if (currentUser) {
      this.loadData();
    }
  }
}
