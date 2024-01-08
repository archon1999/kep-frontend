import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'ng-select-css',
  templateUrl: './ng-select.component.html',
  styleUrls: ['./ng-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NgSelectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
