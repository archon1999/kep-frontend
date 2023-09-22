import { BaseConfig } from "../../basic/base-config";

export interface MinDateConfig extends BaseConfig {
  value: string | Date;
}

export const minDateDefaultConfig: MinDateConfig = {
  errorName: 'minDateError',
  errorTranslateMessage: 'MIN_DATE_ERROR',
  value: "",
}
