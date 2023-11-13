import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { SidebarType } from 'app/modules/problems/constants/sidebar-type';

@Component({
  selector: 'problem-sidebar',
  templateUrl: './problem-sidebar.component.html',
  styleUrls: ['./problem-sidebar.component.scss']
})
export class ProblemSidebarComponent {

  @Input() problem: Problem;

  public SidebarType = SidebarType;
  public sidebarType = SidebarType.INFO;

}
