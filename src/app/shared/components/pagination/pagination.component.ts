import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() @Output() page: number;
  @Input() @Output() pageSize: number;
  @Input() pageOptions: Array<number> = [];
  @Input() collectionSize: number;
  @Input() maxSize: number;
  @Input() rotate = true;
  @Input() color = 'primary';
  @Input() ellipses = false;
  @Input() boundaryLinks = true;

  @Output() pageChange = new EventEmitter<number>;
  @Output() pageSizeChange = new EventEmitter<number>;

  ngOnInit(): void {}

  change(page: number) {
    this.pageChange.next(page);
  }

  sizeChange(pageSize: number) {
    this.pageSizeChange.next(pageSize);
  }

}
