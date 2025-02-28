import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AfterViewChecked,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { EditorComponent, MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { AttemptLangs } from 'app/modules/problems/constants';
import { getEditorLang } from 'app/modules/problems/utils';


@Component({
  selector: 'monaco-editor',
  template: `
    <ngx-monaco-editor [style.height.px]="height" [options]="options" [(ngModel)]="value"></ngx-monaco-editor>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true
    }
  ],
  styleUrl: './monaco-editor.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MonacoEditorModule, FormsModule],
})
export class MonacoEditorComponent implements ControlValueAccessor, OnInit, OnChanges, AfterViewChecked {

  @ViewChild(EditorComponent) editorComponent: EditorComponent;

  @Input() lang: AttemptLangs;
  @Input() height = 300;
  @Input() tabSize = 4;

  public options = {
    theme: 'vs-dark',
    language: 'python',
    minimap: {
      enabled: false,
    },
  };
  public value: string;
  public disabled: boolean;

  onChange: () => {};
  onTouched: () => {};

  constructor(
    public languageService: LanguageService,
  ) {
  }

  ngOnInit() {
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
