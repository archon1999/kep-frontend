import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { getControlName } from './form-control-name';

export function synchronizeArrayControl(control: AbstractControl) {
  const formGroup = control.parent;
  const formArray = formGroup.parent as FormArray;
  const formControlName = getControlName(control);
  control.valueChanges.subscribe(
    () => {
      formArray.controls.forEach(
        // tslint:disable-next-line:no-shadowed-variable
        (formGroup: FormGroup) => {
          const otherControl = formGroup.get(formControlName);
          if (control === otherControl) {
            return;
          }
          setTimeout(
            () => {
              otherControl.updateValueAndValidity({onlySelf: true, emitEvent: false});
            },
            100
          );
        }
      );
    }
  );
}
