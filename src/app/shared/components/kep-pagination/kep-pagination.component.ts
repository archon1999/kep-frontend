import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { FormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";

@Component({
  selector: 'kep-pagination',
  templateUrl: './kep-pagination.component.html',
  styleUrls: ['./kep-pagination.component.scss'],
  standalone: true,
  imports: [
    NgbPaginationModule,
    NgSelectModule,
    FormsModule,
    TranslatePipe,
    KepIconComponent,
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
  @Input() disabled = false;

  @Output() pageChange = new EventEmitter<number>;
  @Output() pageSizeChange = new EventEmitter<number>;

  change(page: number) {
    this.pageChange.next(page);
  }

  sizeChange(pageSize: number) {
    this.pageSizeChange.next(pageSize);
  }

}
