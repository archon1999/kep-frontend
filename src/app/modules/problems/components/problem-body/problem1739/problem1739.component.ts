import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { HtmlProblemBodyComponent } from '@problems/components/problem-body/html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1739',
  templateUrl: './problem1739.component.html',
  styleUrls: ['./problem1739.component.scss'],
  standalone: true,
  imports: [HtmlProblemBodyComponent]
})
export class Problem1739Component {
  @Input() problem: Problem;
}
