import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from '@shared/page-result';
import { BasePageComponent } from '@shared/components/classes/base-page.component';
import { Params } from '@angular/router';

@Component({
  template: '',
  standalone: true
})
export class BaseTablePageComponent<T> extends BasePageComponent {
  public pageNumber: number;
  public pageSize: number;
  public total: number;
  public pagesCount: number;
  public maxSize: number;
  public ordering: string;

  public pageQueryParam = 'page';

  public isLoading = true;
  public isError = false;
  public pageResult: PageResult<T>;

  afterFirstChangeQueryParams(params: Params) {
    console.log(params);
    if (params.page) {
      this.pageNumber = +params.page;
    }
    if (params.ordering) {
      this.ordering = params.ordering;
    }
  }

  getPage(): Observable<PageResult<T>> | null {
    return null;
  }

  pageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.reloadPage();
  }

  orderingChange(ordering: string) {
    this.ordering = ordering;
    this.updateQueryParams({ ordering: ordering }, true);
    this.reloadPage();
  }

  reloadPage() {
    this.isLoading = true;
    this.isError = false;
    this.getPage().subscribe(
      (pageResult: PageResult<T>) => {
        this.updateQueryParams({ [this.pageQueryParam]: pageResult.page });
        this.pageResult = pageResult;
        this.pageNumber = pageResult.page;
        this.pageSize = pageResult.pageSize;
        this.pagesCount = pageResult.pagesCount;
        this.total = pageResult.total;
        this.reCalcIndexes();
        this.isLoading = false;
      }, () => {
        this.isError = true;
        this.isLoading = false;
      }
    );
  }

  reCalcIndexes() {
    this.pageResult.data.map(
      (obj, index) => {
        // @ts-ignore
        obj.rowIndex = this.pageSize * (this.pageNumber - 1) + index + 1;
        return obj;
      }
    );
  }
}
