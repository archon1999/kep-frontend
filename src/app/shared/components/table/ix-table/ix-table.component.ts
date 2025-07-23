import { AfterContentInit, Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnConfig } from '../configs';
import { CellTemplateDirective } from '../cell-template.directive';
import {
  NgbPagination,
  NgbPaginationFirst,
  NgbPaginationLast,
  NgbPaginationNext,
  NgbPaginationPrevious
} from '@ng-bootstrap/ng-bootstrap';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ExtractKeys, getByPath } from '@shared/components/table';
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  standalone: true,
  selector: 'ix-table',
  imports: [
    CommonModule,
    NgbPagination,
    NgSelectComponent,
    FormsModule,
    NgOptionComponent,
    NgbPaginationFirst,
    NgbPaginationPrevious,
    NgbPaginationNext,
    NgbPaginationLast,
    NgxSkeletonLoaderModule,
    KepIconComponent,
    TranslatePipe,
  ],
  templateUrl: './ix-table.component.html',
  styleUrl: './ix-table.component.scss',
})
export class IxTableComponent<T = any> implements AfterContentInit {
  @Input() columns: ColumnConfig<T>[] = [];
  @Input() data: T[] = [];
  @Input() isLoading = false;
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() pagesCount = 1;
  @Input() ordering = '';
  @Input() total = 0;
  @Input() pageOptions = [10, 20, 50];
  @Input() slots: QueryList<CellTemplateDirective>;

  @Output() pageChange = new EventEmitter<number>();
  @Output() orderingChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  private slotMap = new Map<string, CellTemplateDirective>();

  ngAfterContentInit() {
    this.slotMap = new Map(this.slots.map(d => [d.field, d]));
  }

  tplFor(field: string) {
    return this.slotMap.get(field)?.tpl;
  }

  getCellValue<T>(
    row: T,
    col: ColumnConfig<T>
  ): unknown {
    const {field} = col;

    // @ts-ignore
    if (typeof field === 'function') {
      // @ts-ignore
      return field(row);
    }

    return getByPath(row, field);
  }

  // @ts-ignore
  tplKey<T, K extends ExtractKeys<T>>(col: ColumnConfig<T, K>): string {
    if (col.key) {
      return col.key;
    }
    if (typeof col.field === 'string') {
      return col.field;
    }
    return '';
  }

  // @ts-ignore
  getOrderingKey<T, K extends ExtractKeys<T>>(
    col: ColumnConfig<T, K>
  ): string {
    if (col.orderingKey) {
      return col.orderingKey;
    }

    if (typeof col.field === 'string') {
      // @ts-ignore
      const path = col.field;
      // @ts-ignore
      const dotIndex = path.indexOf('.');
      // @ts-ignore
      return dotIndex === -1 ? path : path.substring(0, dotIndex);
    }

    return '';
  }

  sort(col: ColumnConfig<T>) {
    if (!col.sortable) return;
    // @ts-ignore
    const key = this.getOrderingKey(col);
    const next = this.ordering === key ? `-${key}` : this.ordering === `-${key}` ? '' : key;
    this.orderingChange.emit(next);
  }
}
