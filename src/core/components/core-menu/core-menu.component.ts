import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from 'core/components/core-menu/core-menu.service';
import { ApiService } from 'app/shared/services/api.service';
import { CoreCommonModule } from '@core/common.module';
import { CoreMenuVerticalItemComponent } from '@core/components/core-menu/vertical/item/item.component';
import { CoreMenuVerticalSectionComponent } from '@core/components/core-menu/vertical/section/section.component';
import { CoreMenuVerticalCollapsibleComponent } from '@core/components/core-menu/vertical/collapsible/collapsible.component';
import { CoreMenuHorizontalItemComponent } from '@core/components/core-menu/horizontal/item/item.component';
import { CoreMenuHorizontalCollapsibleComponent } from '@core/components/core-menu/horizontal/collapsible/collapsible.component';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    CoreMenuVerticalItemComponent,
    CoreMenuVerticalSectionComponent,
    CoreMenuVerticalCollapsibleComponent,
    CoreMenuHorizontalItemComponent,
    CoreMenuHorizontalCollapsibleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _coreMenuService: CoreMenuService,
    public api: ApiService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();

    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.currentUser = this._coreMenuService.currentUser;
      this.menu = this._coreMenuService.getCurrentMenu();

      // this.loadEvents();

      this._changeDetectorRef.markForCheck();
    });
  }

}
