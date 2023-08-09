import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../../../@core/services/config.service';
import { CoreConfig } from '../../../../../../@core/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contest } from '../../../contests.models';

@Component({
  selector: 'contest-card-countdown',
  templateUrl: './contest-card-countdown.component.html',
  styleUrls: ['./contest-card-countdown.component.scss']
})
export class ContestCardCountdownComponent implements OnInit {

  @Input() contest: Contest;

  public coreConfig: CoreConfig;
  public clockColor: string;
  public textColor: string;

  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((coreConfig: any) => {
        this.coreConfig = coreConfig
        if(this.coreConfig.layout.skin == 'dark'){
          this.clockColor = '#ffffff';
          this.textColor = '#ffffff';
        } else {
          this.clockColor = '#4e46a3';
          this.textColor = '#7367f0';
        }
      });
  }

}
