import { BaseConfig } from '../../basic/base-config';

export interface RequiredConfig extends BaseConfig {}

export const requiredDefaultConfig: RequiredConfig = {
  errorName: 'requiredError',
  errorTranslateMessage: 'REQUIRED_ERROR',
}
