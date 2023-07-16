import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ApiService } from '../../../../api.service';
import { Contest, ContestStatus } from '../../../../modules/contests/contests.models';

@Component({
  selector: 'contest-card-big',
  templateUrl: './contest-card-big.component.html',
  styleUrls: ['./contest-card-big.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })]
})
export class ContestCardBigComponent implements OnInit {

  @Input() contest: Contest;

  top3Contestants: Array<any> = [];

  constructor(
    public api: ApiService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
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
