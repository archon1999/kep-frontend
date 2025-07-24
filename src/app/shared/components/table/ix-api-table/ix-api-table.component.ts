import { Component, ContentChildren, inject, Input, OnInit, QueryList } from '@angular/core';
import { ColumnConfig, PageParams, PageResult } from '@shared/components/table/configs';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CellTemplateDirective } from '../cell-template.directive';
import { WithDestroyMixin } from '@core/mixins';
import { IxTableComponent } from '@shared/components/table/ix-table/ix-table.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseComponent } from "@core/common";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'ix-api-table',
  imports: [
    IxTableComponent,
    TranslatePipe,
    KepCardComponent
  ],
  templateUrl: './ix-api-table.component.html',
  standalone: true,
  styleUrl: './ix-api-table.component.scss'
})
export class IxApiTableComponent<T = any> extends WithDestroyMixin(BaseComponent) implements OnInit {
  @Input({required: true}) columns: ColumnConfig<T>[] = [];
  @Input({required: true}) fetchPage!: (p: PageParams) => Observable<PageResult<T>>;
  @Input({required: true}) title: string;
  @Input() params: PageParams = {};
  @Input() pageOptions: number[] = [10, 20, 50];

  protected pageNumber = 1;
  protected pageSize = 10;
  protected ordering = '';
  protected isLoading = true;
  protected pagesCount = 1;
  protected total = 0;
  protected pageResult!: PageResult<T>;

  @ContentChildren(CellTemplateDirective) protected slots!: QueryList<CellTemplateDirective>;

  protected toast = inject(ToastrService);

  protected get paginationParams() {
    return {
      page: this.pageNumber,
      pageSize: this.pageSize,
      ordering: this.ordering,
    }
  }

  ngOnInit() {
    if (this.params.ordering) this.ordering = this.params.ordering;
    if (this.params.pageSize) this.pageSize = this.params.pageSize;
    if (this.params.page) this.pageNumber = this.params.page;
    this.load({ ...this.params, ...this.paginationParams });
  }

  load(params: PageParams) {
    this.params = {
      ...this.params,
      ...params,
    }
    this.isLoading = true;
    this.fetchPage(this.params)
      .pipe(this.takeUntilDestroy())
      .subscribe({
        next: pageResult => {
          this.pageResult = pageResult;
          this.pageNumber = pageResult.page;
          this.pageSize = pageResult.pageSize;
          this.pagesCount = pageResult.pagesCount;
          this.total = pageResult.total;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Failed to load data');
        }
      });
  }

  protected pageChange(number: number) {
    this.pageNumber = number;
    this.load(this.paginationParams);
  }

  protected orderingChange(ordering: string) {
    this.ordering = ordering;
    this.pageNumber = 1;
    this.load(this.paginationParams);
  }

  protected pageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.load(this.paginationParams);
  }
}
