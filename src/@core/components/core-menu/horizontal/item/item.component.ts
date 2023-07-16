import { Component, Input } from '@angular/core';

@Component({
  selector: '[core-menu-horizontal-item]',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class CoreMenuHorizontalItemComponent {
  @Input()
  item: any;
}
