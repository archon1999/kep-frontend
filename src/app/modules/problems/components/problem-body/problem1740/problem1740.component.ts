import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import {
  HtmlProblemBodyComponent
} from '@problems/components/problem-body/html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1740',
  templateUrl: './problem1740.component.html',
  styleUrls: ['./problem1740.component.scss'],
  standalone: true,
  imports: [HtmlProblemBodyComponent]
})
export class Problem1740Component {
  @Input() problem: Problem;
}
