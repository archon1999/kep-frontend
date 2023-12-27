import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { HtmlProblemBodyComponent } from '../html-problem-body/html-problem-body.component';

@Component({
  selector: 'problem1744',
  templateUrl: './problem1744.component.html',
  styleUrls: ['./problem1744.component.scss'],
  standalone: true,
  imports: [HtmlProblemBodyComponent]
})
export class Problem1744Component {
  @Input() problem: Problem;
}
