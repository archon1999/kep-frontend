import { Component, Input, OnInit } from '@angular/core';
import { StudyPlan } from '../../models/problems.models';

@Component({
  selector: 'study-plan-card',
  templateUrl: './study-plan-card.component.html',
  styleUrls: ['./study-plan-card.component.scss'],
  standalone: false,
})
export class StudyPlanCardComponent implements OnInit {

  @Input() studyPlan: StudyPlan;

  constructor() { }

  ngOnInit(): void {
  }

}
