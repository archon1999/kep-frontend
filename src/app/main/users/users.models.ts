export class User {
  constructor(
    public username: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public dateJoined: string,
    public avatar: string,
    public coverPhoto: string,
    public balls: number,
    public isOnline: boolean,
    public lastSeen: Date,
    public kepcoin: number,
    public streak: number,
  ) { }
}

export interface UserGeneralInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
}

export interface Achievement {
  id: number;
  type: number;
  title: string;
  description: string;
  totalProgress: number;
  userResult: {
    progress: number;
    done: boolean;
  }
}

export class UserInfo {
  constructor(
    public country: string,
    public region: string,
    public website: string,
    public email: string,
    public emailVisible: boolean,
    public dateJoined: Date | string,
    public dateOfBirth: Date | string,
    public bio: string,
  ) { }
}


export class UserSocial {
  constructor(
    public codeforcesHandle: string,
    public telegram: string,
  ) { }
}


export class UserSkills {
  constructor(
    public python: string,
    public django: string,
    public webScraping: string,
    public algo: string,
    public dataScience: string,
  ) { }
}

export class UserTechnology {
  constructor(
    public text: string,
    public devIconClass: string,
    public badgeColor: string,
  ) { }
}


export class UserEducation {
  constructor(
    public organization: string,
    public degree: string,
    public fromYear: number,
    public toYear: number,
  ) { }
}


export class UserWorkExperience {
  constructor(
    public company: string,
    public jobTitle: string,
    public fromYear: number,
    public toYear: number,
  ) { }
}

export enum TeamMemberStatus {
  INVITED = -1,
  FORMER = 0,
  ACTIVE = 1,
}

export class TeamMember {
  constructor(
    public username: string,
    public avatar: string,
    public status: number,
  ) { }
}

export class Team {
  constructor(
    public id: number,
    public createrUsername: string,
    public createrAvatar: string,
    public name: string,
    public members: Array<TeamMember>,
  ) { }
}

export interface UserProblemsRating {
  user: any;
  rating: number;
  solved: number;
  beginner: number;
  basic: number;
  normal: number;
  medium: number;
  advanced: number;
  hard: number;
  extremal: number;
}

export interface UserContestsRating {
  username: string;
  rating: number;
  ratingTitle: string;
  contestantsCount: number;
  maxRating: number;
  maxRatingTitle: string;
}

export interface UserChallengesRating {
  username: string;
  rankTitle: string;
  rating: number;
  wins: number;
  draws: number;
  losses: number;
}
