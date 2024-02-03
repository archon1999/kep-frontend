import { BaseConfig } from '../../basic/base-config';

export interface MaxDateConfig extends BaseConfig {
  value: string | Date;
}

export const maxDateDefaultConfig: MaxDateConfig = {
  errorName: 'maxDateError',
  errorTranslateMessage: 'MAX_DATE_ERROR',
  value: "",
}
