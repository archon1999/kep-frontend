import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { HtmlProblemBodyComponent } from '../html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1841',
  templateUrl: './problem1841.component.html',
  styleUrls: ['./problem1841.component.scss'],
  standalone: true,
  imports: [HtmlProblemBodyComponent]
})
export class Problem1841Component {
  @Input() problem: Problem;
}
