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
      this.isLoading = true;
      setTimeout(() => this.loadData());
    }
    this.loadContentHeader();
  }

  abstract getData(): Observable<T>;

  loadData() {
    this.isLoading = true;
    this.getData().subscribe(
      {
        next: (data) => {
          this.data = data;
          this.afterLoadData(data);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          if (error.status == 404) {
            this.router.navigate(['404'], {skipLocationChange: true});
          }
        }
      }
    );
  }

  afterLoadData(data: T) {}
}
