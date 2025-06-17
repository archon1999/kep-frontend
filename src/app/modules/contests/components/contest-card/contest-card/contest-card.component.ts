import { Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ApiService } from '@core/data-access/api.service';
import { AuthService, AuthUser } from '@auth';
import { ContestsService } from 'app/modules/contests/contests.service';
import { Router } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { KepcoinSpendSwalModule } from '../../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import {
  ContestCountdownComponent
} from '@contests/components/contest-card/contest-card/contest-countdown/contest-countdown.component';
import {
  Top3ContestantsComponent
} from '@contests/components/contest-card/contest-card/top3-contestants/top3-contestants.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { Contest } from '@contests/models/contest';
import { ContestStatus } from '@contests/constants';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { TeamViewCardComponent } from '@app/modules/account-settings/teams/team-view-card/team-view-card.component';
import { getResourceById, Resources } from '@app/resources';
import { NewFeatureDirective } from '@shared/directives/new-feature.directive';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Team } from "@users/domain";

@Component({
  selector: 'contest-card',
  templateUrl: './contest-card.component.html',
  styleUrls: ['./contest-card.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    KepcoinSpendSwalModule,
    ContestCountdownComponent,
    Top3ContestantsComponent,
    SpinnerComponent,
    MathjaxModule,
    NgSelectModule,
    TeamViewCardComponent,
    NewFeatureDirective,
    ContestClassesPipe,
    KepCardComponent,
  ]
})
export class ContestCardComponent implements OnInit {

  @Input() contest: Contest;
  @ViewChild('registrationModal') public registrationModalRef: TemplateRef<any>;

  public userTeams: Array<Team> = [];
  public teamId: number;
  public routerLink: string | Array<string | number>;

  public currentUser: AuthUser | null;

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

  openRegistrationModal() {
    if (this.contest.participationType === 1) {
      this.service.contestRegistration(this.contest.id).subscribe((result: any) => {
        if (result.success) {
          this.contest.userInfo.isRegistered = true;
        }
      });
    } else {
      this.service.getUserTeams().subscribe(
        (teams: Array<Team>) => {
          if (teams.length === 0) {
            this.router.navigateByUrl(Resources.SettingsTeams);
          } else {
            this.userTeams = teams;
            this.modalService.open(this.registrationModalRef, {
              size: 'lg',
            });
          }
        }
      );
    }
  }

  registrationTeam() {
    this.service.contestRegistration(this.contest.id, this.teamId).subscribe((result: any) => {
      if (result.success) {
        this.modalService.dismissAll();
        this.contest.userInfo.isRegistered = true;
      }
    });
  }

  cancelRegistration() {
    if (this.contest.status !== ContestStatus.ALREADY) {
      this.service.cancelRegistration(this.contest.id).subscribe(
        (result) => {
          if (result.success) {
            this.contest.userInfo.isRegistered = false;
          }
        }
      );
    }
  }

  virtualContestPurchaseSuccess() {
    this.contest.userInfo.virtualContestPurchased = true;
  }

  virtualContestStart() {
    this.service.virtualContestStart(this.contest.id).subscribe(
      () => {
        this.router.navigate([getResourceById(Resources.Contests, this.contest.id)]);
        this.service.getContest(this.contest.id).subscribe(
          (contest: Contest) => {
            this.contest = contest;
          }
        );
      }
    );
  }
}
