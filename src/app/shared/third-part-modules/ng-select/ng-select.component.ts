import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ng-select-css',
  templateUrl: './ng-select.component.html',
  styleUrls: ['./ng-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NgSelectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}
}
