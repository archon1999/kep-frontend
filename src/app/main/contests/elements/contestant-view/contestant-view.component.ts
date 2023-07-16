import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'contestant-view',
  templateUrl: './contestant-view.component.html',
  styleUrls: ['./contestant-view.component.scss']
})
export class ContestantViewComponent implements OnInit {

  @Input() user: any;
  @Input() team: any;
  @Input() textColor = '';
  @Input() teamNameColor = 'primary';
  @Input() imgSize: number = 32;

  constructor() { }

  ngOnInit(): void {
  }

}
