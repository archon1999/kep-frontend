import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/components/classes/base.component';
import { Observable } from 'rxjs';

@Component({
  template: '',
  standalone: true
})
export class BaseLoadComponent<T> extends BaseComponent implements OnInit {
  public data: T;
  public isLoading = false;
  public loadOnInit = true;

  ngOnInit() {
    if (this.loadOnInit) {
      setTimeout(() => this.loadData());
    }
  }

  getData(): Observable<T> | null {
    return null;
  }

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
