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
  skillsRating: any;
  activityRating: any;
  contestsRating: any;
  challengesRating: any;
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