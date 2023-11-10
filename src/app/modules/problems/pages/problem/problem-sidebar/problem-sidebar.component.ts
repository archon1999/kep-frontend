import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Problem } from '../../../models/problems.models';
import { ProblemsService } from 'app/modules/problems/services/problems.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { AttemptLangs } from 'app/modules/problems/constants';
import { SidebarType } from 'app/modules/problems/constants/sidebar-type';

@Component({
  selector: 'problem-sidebar',
  templateUrl: './problem-sidebar.component.html',
  styleUrls: ['./problem-sidebar.component.scss']
})
export class ProblemSidebarComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public SidebarType = SidebarType;
  public sidebarType = SidebarType.INFO;

  private _unsubscribeAll = new Subject();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {    
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
