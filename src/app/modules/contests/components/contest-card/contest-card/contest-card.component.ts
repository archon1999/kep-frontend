import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ApiService } from '@shared/services/api.service';
import { User } from '@auth/models';
import { AuthService } from '@auth/service';
import { ContestsService } from 'app/modules/contests/contests.service';
import { Router } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinSpendSwalModule } from '../../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { ContestCountdownComponent } from '@contests/components/contest-card/contest-card/contest-countdown/contest-countdown.component';
import { Top3ContestantsComponent } from '@contests/components/contest-card/contest-card/top3-contestants/top3-contestants.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ContestStatus } from '@contests/constants/contest-status';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'contest-card',
  templateUrl: './contest-card.component.html',
  styleUrls: ['./contest-card.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    KepcoinSpendSwalModule,
    ContestCountdownComponent,
    Top3ContestantsComponent,
    SpinnerComponent,
    MathjaxModule,
  ]
})
export class ContestCardComponent implements OnInit {

  @Input() contest: Contest;
  public routerLink: string | Array<string | number>;

  public top3Contestants: Array<any> = [];

  public currentUser: User | null;

  constructor(
    public api: ApiService,
    public modalService: NgbModal,
    public authService: AuthService,
    public service: ContestsService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.routerLink = ['/competitions', 'contests', 'contest', this.contest.id];
    if (this.router.url.endsWith(this.contest.id.toString())) {
      this.routerLink.push('problems');
    }

    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
  }

  openRegistrationModal(content) {
    if (this.contest.participationType == 1) {
      this.service.contestRegistration(this.contest.id).subscribe((result: any) => {
        if (result.success) {
          this.contest.userInfo.isRegistered = true;
        }
      });
    } else {
      this.modalService.open(content, { centered: true });
    }
  }

  cancelRegistration() {
    if (this.contest.participationType == 1) {
      this.api.get(`contests/${ this.contest.id }/cancel-registration/`).subscribe((result: any) => {
        if (result.success) {
          this.contest.userInfo.isRegistered = false;
        }
      });
    }
  }

  virtualContestPurchaseSuccess() {
    this.contest.userInfo.virtualContestPurchased = true;
  }

  virtualContestStart() {
    this.service.virtualContestStart(this.contest.id).subscribe(
      () => {
        this.router.navigate(['/competitions', 'contests', 'contest', this.contest.id]);
        this.service.getContest(this.contest.id).subscribe(
          (contest: any) => {
            this.contest = contest;
          }
        );
      }
    );
  }
}
