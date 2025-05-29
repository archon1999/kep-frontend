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