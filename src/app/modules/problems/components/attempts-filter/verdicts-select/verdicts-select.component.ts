import { Component, forwardRef, inject, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Verdicts } from '@problems/constants';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { NgIf } from '@angular/common';

@Component({
  selector: 'verdicts-select',
  standalone: true,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './verdicts-select.component.html',
  styleUrl: './verdicts-select.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VerdictsSelectComponent),
    multi: true
  }]
})
export class VerdictsSelectComponent implements ControlValueAccessor, OnInit {
  @Input() value: Verdicts;

  public control: AbstractControl;
  public verdicts: Array<{
    label: string,
    value: Verdicts,
  }>;
  private service = inject(ProblemsApiService);

  constructor(private _injector: Injector) {}

  ngOnInit() {
    setTimeout(() => this.control = this._injector.get(NgControl).control);
    this.service.getVerdicts().subscribe(
      (verdicts) => {
        this.verdicts = verdicts;
      }
    );
  }

  onChange(value: any) {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: any): void {
    this.value = value;
  }
}
