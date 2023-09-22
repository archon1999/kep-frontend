import { BaseConfig } from "../../basic/base-config";

export interface PatternConfig extends BaseConfig {
  regex: RegExp;
}

export const patternDefaultConfig: PatternConfig = {
  errorName: 'patternError',
  errorTranslateMessage: 'PATTERN_ERROR',
  regex: new RegExp(''),
}
