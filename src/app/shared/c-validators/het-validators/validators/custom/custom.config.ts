import { BaseConfig } from "../../basic/base-config";
import { AbstractControl } from "@angular/forms";

export interface CustomConfig extends BaseConfig {
  fn: (control: AbstractControl) => boolean;
}

export const customDefaultConfig: CustomConfig = {
  errorName: 'customError',
  errorTranslateMessage: 'CUSTOM_ERROR',
  fn: null,
}
