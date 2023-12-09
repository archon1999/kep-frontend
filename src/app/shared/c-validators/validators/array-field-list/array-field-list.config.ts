import { BaseConfig } from "../../basic/base-config";

export interface ArrayFieldListConfig extends BaseConfig {
  fn: (fieldValue: any, fieldsValueList: Array<any>) => boolean;
}

export const arrayFieldListDefaultConfig: ArrayFieldListConfig = {
  errorName: 'arrayFieldListError',
  errorTranslateMessage: 'ARRAY_FIELD_LIST_ERROR',
  fn: null,
}
