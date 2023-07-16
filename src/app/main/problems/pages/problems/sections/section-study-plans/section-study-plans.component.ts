import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudyPlan } from 'app/main/problems/problems.models';

@Component({
  selector: 'section-study-plans',
  templateUrl: './section-study-plans.component.html',
  styleUrls: ['./section-study-plans.component.scss'],
})
export class SectionStudyPlansComponent implements OnInit {

  public studyPlans: Array<StudyPlan> = [];

  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ studyPlans }) => {
      this.studyPlans = studyPlans;
    })
  }

}
