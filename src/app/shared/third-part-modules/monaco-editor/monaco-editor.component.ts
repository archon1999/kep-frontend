import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AfterViewInit, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
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
    <ngx-monaco-editor style="height: 100%;" [options]="options" [(ngModel)]="value"></ngx-monaco-editor>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true
    }
  ]
})
export class MonacoEditorComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @ViewChild(EditorComponent) editorComponent: EditorComponent;

  @Input() lang: AttemptLangs;
  public options = {
    theme: 'vs-light',
    language: 'python',
    minimap: {
      enabled: false,
    },
    fontFamily: 'Inconsolata',
    fontSize: 15,
    roundedSelection: true,
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
    this.coreConfigService.getConfig().subscribe(
      (config: CoreConfig) => {
        this.options.theme = (config.layout.skin === 'dark' ? 'vs-dark' : 'vs-light');
      }
    );

    this.languageService.getLanguage().subscribe(
      (lang: AttemptLangs) => {
        this.options.language = getEditorLang(this.lang || lang);
      }
    );
  }

  ngAfterViewInit(): void {
    this.editorComponent.registerOnChange(this.onChange);
    this.editorComponent.registerOnTouched(this.onTouched);
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