import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { HtmlProblemBodyComponent } from '../html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1840',
  templateUrl: './problem1840.component.html',
  styleUrls: ['./problem1840.component.scss'],
  standalone: true,
  imports: [HtmlProblemBodyComponent]
})
export class Problem1840Component {
  @Input() problem: Problem;
}
