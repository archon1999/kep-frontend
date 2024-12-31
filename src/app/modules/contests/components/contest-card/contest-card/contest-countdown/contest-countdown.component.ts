import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { ContestStatus } from '@contests/constants/contest-status';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'contest-countdown',
  templateUrl: './contest-countdown.component.html',
  styleUrls: ['./contest-countdown.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, CountdownComponent, NgbTooltipModule]
})
export class ContestCountdownComponent implements OnInit {

  @Input() clockColor = '#19115e';
  @Input() textColor = '#fff';
  @Input() contest: Contest;

  public leftTime = 0;
  public stopTime = 0;

  @ViewChild('finishModal') public finishModalRef: TemplateRef<any>;
  @ViewChild('startModal') public startModalRef: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    const time = this.contest.status === ContestStatus.ALREADY ? this.contest.finishTime : this.contest.startTime;
    this.stopTime = new Date(time).valueOf();
    this.leftTime = (new Date(time).valueOf() - Date.now());
  }

  finish() {
    if (this.contest.status === ContestStatus.NOT_STARTED) {
      this.contest.status = ContestStatus.ALREADY;
      this.modalService.open(this.startModalRef);
    } else if (this.contest.status === ContestStatus.ALREADY) {
      this.contest.status = ContestStatus.FINISHED;
      this.modalService.open(this.finishModalRef);
    }
  }

}
