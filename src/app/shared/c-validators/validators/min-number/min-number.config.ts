import { BaseConfig } from '../../basic/base-config';

export interface MinNumberConfig extends BaseConfig {
  value: number;
}

export const minNumberDefaultConfig: MinNumberConfig = {
  errorName: 'minNumberError',
  errorTranslateMessage: 'MIN_NUMBER_ERROR',
  value: 0,
}
