import { ContestantTeamMember } from '@contests/models/contestant-team-member';
import { ContestProblemInfo } from '@contests/models/contest-problem-info';

export class Contestant {
  constructor(
    public username: string,
    public userFullName: string,
    public team: {
      name: string;
      members: Array<ContestantTeamMember>;
    },
    public type: number,
    public problemsInfo: Array<ContestProblemInfo>,
    public points: number,
    public penalties: number,
    public rank: number,
    public rating: number,
    public ratingTitle: string,
    public seed: number,
    public delta: number,
    public bonus: number,
    public perfomance: number,
    public perfomanceTitle: string,
    public newRating: number,
    public newRatingTitle: string,
    public doubleRatingPurchased: boolean,
    public saveRatingPurchased: boolean,
    public isVirtual: boolean,
    public isUnrated: boolean,
    public isOfficial: boolean,
    public virtualTime: string,
    public country: string,
    public rowClass?: string,
  ) {}

  static fromJSON(data: any) {
    return new Contestant(
      data.username,
      data.userFullName,
      data.team,
      data.type,
      data.problemsInfo.map(problemInfo => ContestProblemInfo.fromJSON(problemInfo)),
      data.points,
      data.penalties,
      data.rank,
      data.rating,
      data.ratingTitle,
      data.seed,
      data.delta,
      data.bonus,
      data.perfomance,
      data.perfomanceTitle,
      data.newRating,
      data.newRatingTitle,
      data.doubleRatingPurchased,
      data.saveRatingPurchased,
      data.isVirtual,
      data.isUnrated,
      data.isOfficial,
      data.virtualTime,
      data.country,
    );
  }
}
