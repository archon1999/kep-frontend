import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from 'core/services/config.service';
import { RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { ContentModule } from '@layout/components/content/content.module';
import { FooterModule } from '@layout/components/footer/footer.module';
import { NavbarComponent } from '@layout/components/navbar/navbar.component';
import { MenuComponent } from '@layout/components/menu/menu.component';

@Component({
  selector: 'horizontal-layout',
  templateUrl: './horizontal-layout.component.html',
  styleUrls: ['./horizontal-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    RouterModule,
    CoreCommonModule,
    CoreSidebarModule,
    NavbarComponent,
    MenuComponent,
    ContentModule,
    FooterModule
  ]
})
export class HorizontalLayoutComponent implements OnInit, OnDestroy {
  coreConfig: any;

  private _unsubscribeAll: Subject<any>;

  constructor(private _coreConfigService: CoreConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
