import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/common/classes/base.component';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";

export type WithContentHeader = {
  contentHeader: ContentHeader;
  getContentHeader(): ContentHeader;
  loadContentHeader(): void;
};

export function WithContentHeaderMixin<T extends Constructor<BaseComponent>>(Base: T) {
  @Component({
    template: '',
    standalone: true
  })
  class WithContentHeaderClass extends Base implements WithContentHeader, OnInit {
    contentHeader: ContentHeader;

    ngOnInit() {
      super.ngOnInit?.();
      this.loadContentHeader();
    }

    getContentHeader(): ContentHeader {
      return null;
    }

    loadContentHeader() {
      this.contentHeader = this.getContentHeader();
    }
  }

  return WithContentHeaderClass;
}

type Constructor<T = {}> = new (...args: any[]) => T;
