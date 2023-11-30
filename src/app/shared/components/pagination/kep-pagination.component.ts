import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';

@Component({
  selector: 'kep-pagination',
  templateUrl: './kep-pagination.component.html',
  styleUrls: ['./kep-pagination.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbPaginationModule,
    NgSelectModule,
  ]
})
export class KepPaginationComponent {

  @Input() @Output() page: number;
  @Input() @Output() pageSize: number;
  @Input() pageOptions: Array<number> = [];
  @Input() collectionSize: number;
  @Input() maxSize: number;
  @Input() rotate = true;
  @Input() color = 'primary';
  @Input() ellipses = false;
  @Input() boundaryLinks = true;
  @Input() customClass = 'mt-2';

  @Output() pageChange = new EventEmitter<number>;
  @Output() pageSizeChange = new EventEmitter<number>;

  change(page: number) {
    this.pageChange.next(page);
  }

  sizeChange(pageSize: number) {
    this.pageSizeChange.next(pageSize);
  }

}
