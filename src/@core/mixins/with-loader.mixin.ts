import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BasePageComponent } from '@app/common';

export type WithLoader = {
  data: any;
  isLoading: boolean;
  loadOnInit: boolean;
  getData(): Observable<any>;
  afterLoadData(data: any): void;
  loadData(): void;
};

export function WithLoaderMixin<T extends Constructor<BasePageComponent>>(Base: T) {
  @Component({
    template: '',
    standalone: true
  })
  class WithLoaderClass extends Base implements WithLoader {
    public data: any;
    public isLoading = false;
    public loadOnInit = true;

    override ngOnInit() {
      super.ngOnInit();
      if (this.loadOnInit) {
        this.isLoading = true;
        setTimeout(() => this.loadData());
      }
    }

    getData(): Observable<any> {
      throw new Error('Method getData() must be implemented');
    }

    loadData() {
      this.isLoading = true;
      this.getData().subscribe({
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
      });
    }

    afterLoadData(data: any) {
    }
  }

  return WithLoaderClass;
}

type Constructor<T = {}> = new (...args: any[]) => T;
