import { Component } from '@angular/core';
import { BaseComponent } from '@shared/components/classes/base.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';

@Component({
  template: '',
  standalone: true
})
export class BasePageComponent extends BaseComponent {
  protected contentHeader: ContentHeader;
  protected getContentHeader(): ContentHeader { return null; }
  protected loadContentHeader() { this.contentHeader = this.getContentHeader(); }
}
