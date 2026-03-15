import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';

export const contestHasPenalties = (type?: ContestType) =>
  type === ContestType.ACM20M || type === ContestType.ACM10M || type === ContestType.ACM2H;

export const contestHasBalls = (type?: ContestType) => {
  const ballTypes: ContestType[] = [
    ContestType.IOI,
    ContestType.Ball525,
    ContestType.Ball550,
    ContestType.LessCode,
    ContestType.LessLine,
    ContestType.MultiL,
    ContestType.CodeGolf,
    ContestType.Exam,
    ContestType.Ball,
    ContestType.DC,
  ];

  return type ? ballTypes.includes(type) : false;
};

export const contestUsesRating = (type?: ContestType, isRated?: boolean) =>
  Boolean(isRated) && type !== ContestType.IOI;

export const isAcmStyle = (type?: ContestType) =>
  type === ContestType.ACM2H ||
  type === ContestType.ACM10M ||
  type === ContestType.ACM20M ||
  type === ContestType.OneAttempt ||
  type === ContestType.IQ;

export const formatContestPoints = (value?: number | string | null) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return '0';
  if (Number.isInteger(parsed)) return String(parsed);
  return parsed.toFixed(2).replace(/\.?0+$/, '');
};
