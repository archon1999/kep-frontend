import { AbstractControl, FormControl } from '@angular/forms';

export function getControlName(control: FormControl | AbstractControl): string | null {
  const formGroup = control.parent.controls;
  return Object.keys(formGroup).find(name => control === formGroup[name]) || null;
}
