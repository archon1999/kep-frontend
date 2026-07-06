import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas.ts';
import { ContestTypeInfo } from '../../../domain/entities/contest.entity.ts';

type ContestTypeValue = ContestType | string | ContestTypeInfo | null | undefined;

const contestTypeCode = (type?: ContestTypeValue) =>
  typeof type === 'object' ? type?.code : type;

const contestTypeInfo = (
  type?: ContestTypeValue,
  typeInfo?: ContestTypeInfo | null,
) => typeInfo ?? (typeof type === 'object' ? type : undefined);

export const contestHasPenalties = (
  type?: ContestTypeValue,
  typeInfo?: ContestTypeInfo | null,
) => {
  const info = contestTypeInfo(type, typeInfo);
  if (typeof info?.hasPenalties === 'boolean') return info.hasPenalties;

  const code = contestTypeCode(type);
  return (
    code === ContestType.ACM20M ||
    code === ContestType.ACM10M ||
    code === ContestType.ACM2H ||
    code === ContestType.IQ ||
    code === ContestType.Ball ||
    code === ContestType.Exam
  );
};

export const contestHasBalls = (
  type?: ContestTypeValue,
  typeInfo?: ContestTypeInfo | null,
) => {
  const info = contestTypeInfo(type, typeInfo);
  if (typeof info?.hasBalls === 'boolean') return info.hasBalls;

  const code = contestTypeCode(type);
  const ballTypes: string[] = [
    ContestType.IOI,
    ContestType.Ball525,
    ContestType.Ball550,
    ContestType.LessCode,
    ContestType.LessLine,
    ContestType.MultiL,
    ContestType.CodeGolf,
    ContestType.Exam,
    ContestType.Ball,
    ContestType.CTF,
    ContestType.DC,
  ];

  return code ? ballTypes.includes(code) : false;
};

export const contestUsesRating = (type?: ContestTypeValue, isRated?: boolean) =>
  Boolean(isRated) && contestTypeCode(type) !== ContestType.IOI;

export const isAcmStyle = (type?: ContestTypeValue) => {
  const code = contestTypeCode(type);
  return (
    code === ContestType.ACM2H ||
    code === ContestType.ACM10M ||
    code === ContestType.ACM20M ||
    code === ContestType.OneAttempt ||
    code === ContestType.IQ
  );
};

export const getContestTypeTitle = (
  type?: ContestTypeValue,
  typeInfo?: ContestTypeInfo | null,
) => {
  const info = contestTypeInfo(type, typeInfo);
  return info?.title || contestTypeCode(type) || '';
};

export const formatContestPoints = (value?: number | string | null) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return '0';
  if (Number.isInteger(parsed)) return String(parsed);
  return parsed.toFixed(2).replace(/\.?0+$/, '');
};
