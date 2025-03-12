import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'table-ordering',
  templateUrl: './table-ordering.component.html',
  styleUrls: ['./table-ordering.component.scss'],
  standalone: false,
})
export class TableOrderingComponent {

  @Input() value: string;
  @Input() ordering: string;
  @Input() justifyContent: 'start' | 'between' | 'end' | 'center' = 'center';
  @Input() reverse = false;

  @Output() change = new EventEmitter<string>();

  click() {
    let value: string;
    if (this.reverse) {
      value = '-' + this.ordering;
      if (this.value === '-' + this.ordering) {
        value = this.ordering;
      }
    } else {
      value = this.ordering;
      if (this.value === this.ordering) {
        value = '-' + this.ordering;
      }
    }
    this.change.emit(value);
  }

}
