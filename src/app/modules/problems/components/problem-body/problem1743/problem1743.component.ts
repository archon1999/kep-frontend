import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { HtmlProblemBodyComponent } from '../html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1743',
  templateUrl: './problem1743.component.html',
  styleUrls: ['./problem1743.component.scss'],
  imports: [HtmlProblemBodyComponent],
  standalone: true
})
export class Problem1743Component {
  @Input() problem: Problem;
}
