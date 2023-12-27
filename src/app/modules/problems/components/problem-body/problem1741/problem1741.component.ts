import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { HtmlProblemBodyComponent } from '@problems/components/problem-body/html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1741',
  templateUrl: './problem1741.component.html',
  styleUrls: ['./problem1741.component.scss'],
  standalone: true,
  imports: [HtmlProblemBodyComponent]
})
export class Problem1741Component {
  @Input() problem: Problem;
}
