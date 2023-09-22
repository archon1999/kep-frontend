import { AbstractControl, FormArray, FormGroup } from "@angular/forms";
import { getControlName } from "@shared/helpers/het-validators/utils/form-control-name";

export function synchronizeArrayControl(control: AbstractControl) {
  let formGroup = control.parent;
  let formArray = formGroup.parent as FormArray;
  let formControlName = getControlName(control);
  control.valueChanges.subscribe(
    () => {
      formArray.controls.forEach(
        (formGroup: FormGroup) => {
          let otherControl = formGroup.get(formControlName);
          if (control == otherControl) return;
          setTimeout(
            () => {
              otherControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            },
            100
          )
        }
      )
    }
  )
}
