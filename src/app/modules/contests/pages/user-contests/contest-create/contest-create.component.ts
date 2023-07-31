import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ContestsService } from '../user-contests.service';
import { ContestTypes } from '../../../contests.models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Problem {
  id?: number;
  symbol?: string;
  ball?: number;
}

interface Contest {
  title: string;
  startDate?: NgbDateStruct;
  startTime?: NgbTimeStruct;
  finishDate?: NgbDateStruct;
  finishTime?: NgbTimeStruct;
  type?: string;
  problems: Array<Problem>;
}

@Component({
  selector: 'app-contest-create',
  templateUrl: './contest-create.component.html',
  styleUrls: ['./contest-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContestCreateComponent implements OnInit {
  public contentHeader: ContentHeader = {
    headerTitle: 'CreateContest',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'CONTESTS.CONTESTS',
          isLink: true,
          link: '../..'
        },
        {
          name: 'MyContests',
          isLink: true,
          link: '..',
        }
      ]
    }
  };

  public hasBall = false;
  public contest: Contest;
  public problemsList = [];
  public ContestTypes = ContestTypes;

  constructor(
    public service: ContestsService,
    public router: Router,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.contest = {
      title: '',
      problems: [],
    };  

    this.addProblem();
    this.service.getProblemsList().subscribe((problems: any) => this.problemsList = problems);
  }

  addProblem(){
    this.contest.problems.push({});
  }

  removeProblem(index: number){
    this.contest.problems.splice(index, 1);
  }

  onTypeChange(){
    if(this.contest.type == ContestTypes.BALL525 ||
       this.contest.type == ContestTypes.BALL550 ||
       this.contest.type == ContestTypes.LESS_CODE ||
       this.contest.type == ContestTypes.LESS_LINE ||
       this.contest.type == ContestTypes.EXAM){
        this.hasBall = true;
      } else {
        this.hasBall = false;
      }
  }
  createContest(){
    this.service.createContest(this.contest).subscribe(
      (result: any) => {
        if(result.success){
          let contestId = result.contestId;
          this.router.navigate(['/competitions', 'contests', 'user-contests']);
        } else {
          this.toastr.error('', 'Error');
        }
      }
    )
  }

}
