import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[errorTooltip]',
  templateUrl: './error-tooltip.component.html',
  styleUrls: ['./error-tooltip.component.scss']
})
export class ErrorTooltipComponent implements OnInit, OnChanges {

  @Input() errorTooltip: object;

  public errorMessage: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes) {
    this.errorMessage = '';
    for (const errorName of Object.keys(Object(this.errorTooltip))) {
      this.errorMessage += this.errorTooltip[errorName].errorTranslateMessage;
    }
  }

}
