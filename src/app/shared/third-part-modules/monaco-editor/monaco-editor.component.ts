import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AfterViewChecked, AfterViewInit, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { AttemptLangs } from 'app/modules/problems/constants';
import { getEditorLang } from 'app/modules/problems/utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'monaco-editor',
  template: `
    <ngx-monaco-editor [style.height.px]="height" [options]="options" [(ngModel)]="value"></ngx-monaco-editor>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true
    }
  ]
})
export class MonacoEditorComponent implements ControlValueAccessor, OnInit, OnChanges, AfterViewChecked {

  @ViewChild(EditorComponent) editorComponent: EditorComponent;

  @Input() lang: AttemptLangs;
  @Input() height = 300;
  @Input() tabSize = 4;

  public options = {
    theme: 'vs-light',
    language: 'python',
    minimap: {
      enabled: false,
    },
    fontFamily: 'Inconsolata',
    fontSize: 15,
    roundedSelection: true,
    tabSize: 4,
  };
  public value: string;
  public disabled: boolean;

  onChange: () => {};
  onTouched: () => {};

  constructor(
    public coreConfigService: CoreConfigService,
    public languageService: LanguageService,
  ) {
  }

  ngOnInit() {
    this.options.tabSize = this.tabSize;

    this.coreConfigService.getConfig().subscribe(
      (config: CoreConfig) => {
        this.options.theme = (config.layout.skin === 'dark' ? 'vs-dark' : 'vs-light');
      }
    );

    this.languageService.getLanguage().subscribe(
      (lang: AttemptLangs) => {
        this.lang = this.lang || lang;
        this.options = {
          ...this.options,
          language: getEditorLang(this.lang),
        };
      }
    );
  }

  ngAfterViewChecked(): void {
    this.editorComponent.registerOnChange(this.onChange);
    this.editorComponent.registerOnTouched(this.onTouched);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if ('lang' in changes) {
      this.options = {
        ...this.options,
        language: getEditorLang(changes['lang'].currentValue),
      };
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.editorComponent?.writeValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
