import { Component, Input, OnInit } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { StudyPlan } from '../../models/problems.models';

@Component({
  selector: 'study-plan-card',
  templateUrl: './study-plan-card.component.html',
  styleUrls: ['./study-plan-card.component.scss'],
  animations: [fadeInRightOnEnterAnimation()]
})
export class StudyPlanCardComponent implements OnInit {

  @Input() studyPlan: StudyPlan;

  constructor() { }

  ngOnInit(): void {
  }

}
