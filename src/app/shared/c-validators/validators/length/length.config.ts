import { BaseConfig } from "../../basic/base-config";

export interface LengthConfig extends BaseConfig {
  value: number;
  allowNull?: boolean;
}

export const lengthDefaultConfig: LengthConfig = {
  errorName: 'lengthError',
  errorTranslateMessage: 'LENGTH_ERROR',
  value: 0,
  allowNull: true,
}
