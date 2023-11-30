import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/components/classes/base.component';
import { Observable, of } from 'rxjs';
import { PageResult } from '@shared/page-result';

@Component({
  template: '',
  standalone: true
})
export class BaseTablePageComponent<T> extends BaseComponent implements OnInit, OnDestroy {
  public pageNumber: number;
  public pageSize: number;
  public total: number;
  public pagesCount: number;
  public maxSize: number;

  public isLoading = true;
  public isError = false;
  public pageResult: PageResult<T>;

  ngOnInit() {}

  ngOnDestroy() {}

  getPage(): Observable<PageResult<T>> | null {
    return null;
  }

  reloadPage() {
    this.isLoading = true;
    this.isError = false;
    this.getPage().subscribe(
      (pageResult: PageResult<T>) => {
        console.log(pageResult);
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
