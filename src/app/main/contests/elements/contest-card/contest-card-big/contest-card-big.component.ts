import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ApiService } from 'app/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Contest, ContestStatus } from 'app/main/contests/contests.models';

@Component({
  selector: 'contest-card-big',
  templateUrl: './contest-card-big.component.html',
  styleUrls: ['./contest-card-big.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })]
})
export class ContestCardBigComponent implements OnInit {

  @Input() contest: Contest;

  public top3Contestants: Array<any> = [];

  public currentUser: User | null;

  constructor(
    public api: ApiService,
    public modalService: NgbModal,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    )

    if(this.contest.status == ContestStatus.FINISHED){
      this.api.get(`contests/${this.contest.id}/top3-contestants`).subscribe((result: any) => {
        this.top3Contestants = result;
      })
    }
  }

  openRegistrationModal(content){
    if(this.contest.participationType == 1){
      this.api.post(`contests/${this.contest.id}/registration/`).subscribe((result: any) => {
        if(result.success){
          this.contest.isRegistered = true;
        }
      })
    } else {
      this.modalService.open(content, { centered: true });
    }
  }

  cancelRegistration(){
    if(this.contest.participationType == 1){
      this.api.get(`contests/${this.contest.id}/cancel-registration/`).subscribe((result: any) => {
        if(result.success){
          this.contest.isRegistered = false;
        }
      })
    }
  }

}
