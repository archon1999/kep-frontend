import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'app-problem-discussion',
  templateUrl: './problem-discussion.component.html',
  styleUrls: ['./problem-discussion.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
})
export class ProblemDiscussionComponent {}
