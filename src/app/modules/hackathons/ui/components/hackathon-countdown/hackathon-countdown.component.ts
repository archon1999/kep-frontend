import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { HackathonStatus } from '@hackathons/domain/constants/hackathon-status';
import { Hackathon } from "@hackathons/domain";
import { BaseComponent } from "@app/common";
import { Resources } from "@app/resources";

@Component({
  selector: 'hackathon-countdown',
  templateUrl: './hackathon-countdown.component.html',
  styleUrls: ['./hackathon-countdown.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, CountdownComponent, NgbTooltipModule]
})
export class HackathonCountdownComponent extends BaseComponent implements OnInit {

  @Input() clockColor = 'var(--default-text-color)';
  @Input() textColor = 'var(--default-text-color)';
  @Input() hackathon: Hackathon;

  public leftTime = 0;
  public stopTime = 0;

  @ViewChild('finishModal') public finishModalRef: TemplateRef<any>;
  @ViewChild('startModal') public startModalRef: TemplateRef<any>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    const time = this.hackathon.status === HackathonStatus.ALREADY ? this.hackathon.finishTime : this.hackathon.startTime;
    this.stopTime = new Date(time).valueOf();
    this.leftTime = (new Date(time).valueOf() - Date.now());
  }

  finish() {
    location.reload();
  }

}
