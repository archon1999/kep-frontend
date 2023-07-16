export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isSuperuser: boolean;
  kepcoin: number;
  streak: number;
  permissions: {
    canCreateProblems: boolean;
    canChangeProblemSimilar: boolean;
    canChangeProblemTags: boolean;
  }
}
