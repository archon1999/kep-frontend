import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/common/classes/base.component';
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

  ngOnInit() {
    if (this.loadOnInit) {
      setTimeout(() => this.loadData());
    }
  }

  abstract getData(): Observable<T>;

  loadData() {
    this.isLoading = true;
    this.getData().subscribe(
      (data) => {
        this.data = data;
        this.afterLoadData(data);
        this.isLoading = false;
      }
    );
  }

  afterLoadData(data: T) {}
}
