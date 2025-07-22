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
import { SpendType } from '../../constants/spend-type';

interface UserKepcoinSpend {
  kepcoin: number;
  datetime: string;
  type: SpendType;
}

@Component({
  selector: 'app-kepcoin-spends',
  templateUrl: './spends.component.html',
  standalone: true,
  imports: [
    CoreCommonModule,
    KepTableComponent,
    KepPaginationComponent,
    ContentHeaderModule,
    KepcoinViewModule,
  ]
})
export class SpendsComponent extends BaseTablePageComponent<UserKepcoinSpend> implements OnInit {
  override maxSize = 5;

  protected readonly SpendType = SpendType;

  constructor(private service: KepcoinService) { super(); }

  ngOnInit() {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
  }

  getPage(): Observable<PageResult<UserKepcoinSpend>> {
    return this.service.getUserKepcoinSpends(this.pageable);
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Spends',
      breadcrumb: {
        links: [
          { name: 'Kepcoin', isLink: true, link: '..' },
          { name: 'Spends', isLink: false },
        ]
      }
    };
  }
}
