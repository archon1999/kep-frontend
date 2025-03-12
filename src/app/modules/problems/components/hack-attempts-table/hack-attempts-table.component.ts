import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService, User } from '@auth';
import { WebsocketService } from 'app/shared/services/websocket';
import { ToastrService } from 'ngx-toastr';
import { ProblemsApiService } from '../../services/problems-api.service';
import { SoundsService } from '@shared/services/sounds/sounds.service';
import { HackAttempt, WSHackAttempt } from '@problems/models/hack-attempt.models';

const LANG_CHANGE_EVENT = 'lang-change';
const HACK_ATTEMPT_ADD_EVENT = 'hack-attempt-add';
const HACK_ATTEMPT_DELETE_EVENT = 'hack-attempt-delete';

@Component({
  selector: 'hack-attempts-table',
  templateUrl: './hack-attempts-table.component.html',
  styleUrls: ['./hack-attempts-table.component.scss'],
  standalone: false,
})
export class HackAttemptsTableComponent implements OnInit, OnDestroy {
  public currentUser: User | null;
  public successSoundName = this.soundsService.getSuccessSound();
  @ViewChild('successAudio') successAudio: ElementRef<any>;
  @ViewChild('wrongAudio') wrongAudio: ElementRef<any>;

  constructor(
    public authService: AuthService,
    public wsService: WebsocketService,
    public api: ApiService,
    public modalService: NgbModal,
    public toastr: ToastrService,
    public translationService: TranslateService,
    public service: ProblemsApiService,
    public soundsService: SoundsService,
  ) {
  }

  private _hackAttempts: Array<HackAttempt> = [];

  @Input()
  get hackAttempts(): Array<HackAttempt> {
    return this._hackAttempts;
  }

  set hackAttempts(hackAttempts: Array<HackAttempt>) {
    this.wsService.send(LANG_CHANGE_EVENT, this.translationService.currentLang);
    this._hackAttempts = hackAttempts;
    hackAttempts.forEach(attempt => this.wsService.send(HACK_ATTEMPT_ADD_EVENT, attempt.id));
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );

    this.wsService.on<WSHackAttempt>('hack-attempt-update').subscribe((wsHackAttempt: WSHackAttempt) => {
      for (let i = 0; i < this.hackAttempts.length; i++) {
        if (this.hackAttempts[i].id === wsHackAttempt.id) {
          this.hackAttempts[i].verdict = wsHackAttempt.verdict;
          this.hackAttempts[i].verdictTitle = wsHackAttempt.verdictTitle;
          this.hackAttempts[i].hackType = wsHackAttempt.hackType;
          this.hackAttempts[i] = JSON.parse(JSON.stringify(this.hackAttempts[i]));
        }
      }
    });
  }

  ngOnDestroy() {
    this.hackAttempts.forEach((hackAttempt: HackAttempt) => {
      this.wsService.send(HACK_ATTEMPT_DELETE_EVENT, hackAttempt.id);
    });
  }

}
