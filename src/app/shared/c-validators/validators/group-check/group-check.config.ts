import { BaseConfig } from '../../basic/base-config';

export interface GroupCheckConfig extends BaseConfig {
  fn: (...args: any[]) => boolean;
}

export const groupCheckConfig: GroupCheckConfig = {
  errorName: 'groupCheckError',
  errorTranslateMessage: 'GROUP_CHECK_ERROR',
  fn: null,
}
