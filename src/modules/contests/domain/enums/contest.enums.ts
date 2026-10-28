export const ContestType = {
  ACM2H: 'ACM2H',
  ACM10M: 'ACM10M',
  ACM20M: 'ACM20M',
  IOI: 'IOI',
  Ball525: 'Ball525',
  Ball550: 'Ball550',
  LessCode: 'LessCode',
  LessLine: 'LessLine',
  OneAttempt: 'OneAttempt',
  IQ: 'IQ',
  Ball: 'Ball',
  DC: 'DC',
  MultiL: 'MultiL',
  CodeGolf: 'CodeGolf',
  Exam: 'Exam',
  CTF: 'CTF',
} as const;
export type ContestType = (typeof ContestType)[keyof typeof ContestType];

export const ContestCategory = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  NUMBER_5: 5,
  NUMBER_6: 6,
  NUMBER_7: 7,
  NUMBER_8: 8,
} as const;
export type ContestCategory = (typeof ContestCategory)[keyof typeof ContestCategory];

export const ContestParticipationType = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
} as const;
export type ContestParticipationType =
  (typeof ContestParticipationType)[keyof typeof ContestParticipationType];

export const ContestRegistrantsOrdering = {
  contests_rating: 'contests_rating',
  '-contests_rating': '-contests_rating',
  username: 'username',
  '-username': '-username',
  id: 'id',
  '-id': '-id',
} as const;
export type ContestRegistrantsOrdering =
  (typeof ContestRegistrantsOrdering)[keyof typeof ContestRegistrantsOrdering];
