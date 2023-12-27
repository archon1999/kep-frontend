import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { HtmlProblemBodyComponent } from '../html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1742',
  templateUrl: './problem1742.component.html',
  styleUrls: ['./problem1742.component.scss'],
  standalone: true,
  imports: [HtmlProblemBodyComponent]
})
export class Problem1742Component {
  @Input() problem: Problem;
}
