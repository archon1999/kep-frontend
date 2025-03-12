import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasePageComponent } from '@app/common';

@Component({
  template: '',
  standalone: true
})
export abstract class BaseLoadComponent<T> extends BasePageComponent implements OnInit {
  public data: T;
  public isLoading = false;
  public loadOnInit = true;

  override ngOnInit() {
    if (this.loadOnInit) {
      setTimeout(() => this.loadData());
    }
    this.loadContentHeader();
  }

  abstract getData(): Observable<T>;

  loadData() {
    this.isLoading = true;
    this.getData().subscribe(
      (data) => {
        this.data = data;
        this.afterLoadData(data);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    );
  }

  afterLoadData(data: T) {}
}
