import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from '@app/common/classes/page-result';
import { BasePageComponent } from '@app/common/classes/base-page.component';
import { NavigationStart } from '@angular/router';
import { Pageable } from '@app/common/classes/pageable';
import { takeUntil } from 'rxjs/operators';
import { environment } from "../../../environments/environment";

@Component({
  template: '',
  standalone: true
})
export abstract class BaseTablePageComponent<T> extends BasePageComponent implements OnInit {
  public pageNumber: number;
  public pageSize: number;
  public total: number;
  public pagesCount: number;
  public maxSize: number;
  public ordering: string;
  public defaultOrdering: string;

  public pageOptions = [];
  public pageQueryParam = 'page';
  public pageSizeQueryParam = 'pageSize';
  public defaultPageNumber = 1;
  public defaultPageSize = 10;

  public isLoading = true;
  public isError = false;
  public pageResult: PageResult<T>;

  constructor() {
    super();
    setTimeout(() => this.updatePageParams());
    this.router.events.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (event) => {
        if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
          setTimeout(() => this.updatePageParams());
          if (new URL(event.url, environment.apiUrl).pathname === new URL(this.getLastUrl(), environment.apiUrl).pathname) {
            setTimeout(() => this.reloadPage());
          }
        }
      }
    );
  }

  get pageable(): Partial<Pageable> {
    return {
      page: this.pageNumber,
      pageSize: this.pageSize,
      ordering: this.ordering,
    };
  }

  override ngOnInit() {
    this.loadContentHeader();
    setTimeout(() => this.reloadPage());
  }

  updatePageParams() {
    const params = this._queryParams;
    this.pageNumber = +params[this.pageQueryParam] || this.defaultPageNumber;
    this.pageSize = +params[this.pageSizeQueryParam] || this.defaultPageSize;
    this.ordering = params.ordering || this.defaultOrdering;
  }

  getPage(): Observable<PageResult<T>> {
    return null;
  }

  pageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.reloadPage();
  }

  pageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = this.defaultPageNumber;
    this.reloadPage();
  }

  orderingChange(ordering: string) {
    this.ordering = ordering;
    this.updateQueryParams({ordering: ordering});
    this.pageNumber = this.defaultPageNumber;
    this.reloadPage();
  }

  reloadPage() {
    this.isLoading = true;
    this.isError = false;
    this.getPage().subscribe({
      next: (pageResult: PageResult<T>) => {
        this.updateQueryParams({
          [this.pageQueryParam]: pageResult.page !== this.defaultPageNumber && this.pageQueryParam ? pageResult.page : null,
          [this.pageSizeQueryParam]: pageResult.pageSize !== this.defaultPageSize ? pageResult.pageSize : null,
        });
        this.pageResult = pageResult;
        this.pageNumber = pageResult.page;
        this.pageSize = pageResult.pageSize;
        this.pagesCount = pageResult.pagesCount;
        this.total = pageResult.total;
        this.reCalcIndexes();
        this.isLoading = false;
        this.afterLoadPage(pageResult);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  afterLoadPage(pageResult: PageResult<T>) {
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
