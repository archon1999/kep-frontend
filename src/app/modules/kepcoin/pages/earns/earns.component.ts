import { Component, OnInit } from '@angular/core';
import { BaseTablePageComponent } from '@app/common';
import { PageResult } from '@app/common/classes/page-result';
import { Observable } from 'rxjs';
import { CoreCommonModule } from '@core/common.module';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContentHeader } from '@shared/ui/components/content-header/content-header.component';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { KepcoinService } from '../../kepcoin.service';
import { EarnType } from '../../constants/earn-type';

interface UserKepcoinEarn {
  kepcoin: number;
  datetime: string;
  earnType: EarnType;
}

@Component({
  selector: 'app-kepcoin-earns',
  templateUrl: './earns.component.html',
  standalone: true,
  imports: [
    CoreCommonModule,
    KepTableComponent,
    KepPaginationComponent,
    ContentHeaderModule,
    KepcoinViewModule,
  ]
})
export class EarnsComponent extends BaseTablePageComponent<UserKepcoinEarn> implements OnInit {
  override maxSize = 5;

  protected readonly EarnType = EarnType;

  constructor(private service: KepcoinService) { super(); }

  ngOnInit() {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<UserKepcoinEarn>> {
    return this.service.getUserKepcoinEarns(this.pageable);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Earns',
      breadcrumb: {
        links: [
          { name: 'Kepcoin', isLink: true, link: '..' },
          { name: 'Earns', isLink: false },
        ]
      }
    };
  }
}
