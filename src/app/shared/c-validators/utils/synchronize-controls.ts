import { AbstractControl } from '@angular/forms';

export function synchronizeControls(...controls: AbstractControl[]) {
  controls.forEach((control: AbstractControl) => {
    control.valueChanges.subscribe(
      () => {
        controls.forEach((otherControl: AbstractControl) => {
          if (control === otherControl) {
            return;
          }
          setTimeout(
            () => {
              otherControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            },
            100
          );
        });
      }
    );
  });
}
