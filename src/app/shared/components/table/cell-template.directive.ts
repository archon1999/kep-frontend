import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[cellTemplate]'
})
export class CellTemplateDirective {
  @Input('cellTemplate') field!: string;
  constructor(public tpl: TemplateRef<any>) {}
}
