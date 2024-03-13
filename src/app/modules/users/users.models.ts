export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: string;
  avatar: string;
  coverPhoto: string;
  balls: number;
  isOnline: boolean;
  lastSeen: string;
  kepcoin: number;
  streak: number;
  maxStreak: number;
  country: string;
  skillsRating: number;
  activityRating: number;
  contestsRating: number;
  contestsRatingTitle: string;
  challengesRating: number;
  challengesRankTitle: string;
  problemsSolved: number;
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
  };
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
    public codeforcesBadge: string,
    public telegram: string,
  ) { }
}


export class UserSkills {
  constructor(
    public python: number,
    public webDevelopment: number,
    public webScraping: number,
    public algorithms: number,
    public dataScience: number,
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
    public code: string,
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
