import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { ContestStatus } from '@contests/constants/contest-status';
import { Contest } from '@contests/models/contest';
import { ScriptService } from '@shared/services/script.service';

const JQUERY_SCRIPT_PATH = 'https://code.jquery.com/jquery-3.7.1.min.js';
const TWEENMAX_SCRIPT_PATH = '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js';
const DRAGGABLE_SCRIPT_PATH = '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/utils/Draggable.min.js';
const SCRIPT_PATH = 'assets/js/contest-countdown.js';

@Component({
  selector: 'contest-standings-countdown',
  templateUrl: './contest-standings-countdown.component.html',
  styleUrls: ['./contest-standings-countdown.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, CountdownComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContestStandingsCountdownComponent implements OnInit {
  @Input() contest: Contest;
  @ViewChild('finishModal') public finishModalRef: TemplateRef<any>;
  @ViewChild('startModal') public startModalRef: TemplateRef<any>;

  public leftTime = 0;
  public hours = 0;
  public minutes = 0;
  public seconds = 0;
  protected readonly ContestStatus = ContestStatus;

  constructor(
    private modalService: NgbModal,
    private renderer: Renderer2,
    private scriptService: ScriptService,
  ) {
    this.scriptService.loadJsScript(this.renderer, JQUERY_SCRIPT_PATH).onload = (e) => {
      this.scriptService.loadJsScript(this.renderer, TWEENMAX_SCRIPT_PATH).onload = (e) => {
        this.scriptService.loadJsScript(this.renderer, DRAGGABLE_SCRIPT_PATH).onload = (e) => {
          this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
        };
      };
    };
  }

  ngOnInit(): void {
    if (this.contest.status === ContestStatus.ALREADY) {
      this.leftTime = new Date(this.contest.finishTime).valueOf() - Date.now();
    } else {
      this.leftTime = new Date(this.contest.startTime).valueOf() - Date.now();
    }
    const leftTime = Math.trunc(this.leftTime / 1000);
    this.hours = Math.trunc((leftTime / 60) / 60);
    this.minutes = Math.trunc(leftTime / 60) % 60;
    this.seconds = leftTime % 60;
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
