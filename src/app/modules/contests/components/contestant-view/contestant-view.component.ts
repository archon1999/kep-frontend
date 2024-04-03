import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'contestant-view',
  templateUrl: './contestant-view.component.html',
  styleUrls: ['./contestant-view.component.scss']
})
export class ContestantViewComponent {
  @Input() user: any;
  @Input() team: any;
  @Input() textColor = '';
  @Input() teamNameColor = 'primary';
  @Input() imgSize = 32;
  @Input() isOfficial: boolean;
  @Input() isUnrated: boolean;
  @Input() isVirtual: boolean;
}
