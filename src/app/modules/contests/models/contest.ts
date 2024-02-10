import { ContestAuthor } from '@contests/models/contest-author';
import { ContestUserInfo } from '@contests/models/contest-user-info';
import { ContestStatus, ContestTypes } from '@contests/constants';

export class Contest {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public status: number,
    public authors: Array<ContestAuthor>,
    public problemsCount: number,
    public registrantsCount: number,
    public contestantsCount: number,
    public startTime: Date,
    public finishTime: Date,
    public type: ContestTypes,
    public logo: string,
    public category: number,
    public categoryTitle: string,
    public participationType: number,
    public isRated: boolean,
    public userInfo: ContestUserInfo,
  ) {}

  static fromJSON(data: any) {
    return new Contest(
      data.id,
      data.title,
      data.description,
      data.status,
      data.authors,
      data.problemsCount,
      data.registrantsCount,
      data.contestantsCount,
      new Date(data.startTime),
      new Date(data.finishTime),
      data.type,
      data.logo,
      data.category,
      data.categoryTitle,
      data.participationType,
      data.isRated,
      data.userInfo,
    );
  }

  hasPenalties(): boolean {
    return this.type === ContestTypes.ACM20M || this.type === ContestTypes.ACM2H;
  }

  hasBalls(): boolean {
    return this.type === ContestTypes.BALL525 ||
      this.type === ContestTypes.BALL550 ||
      this.type === ContestTypes.LESS_CODE ||
      this.type === ContestTypes.LESS_LINE ||
      this.type === ContestTypes.MULTI_LINGUAL ||
      this.type === ContestTypes.CODE_GOLF ||
      this.type === ContestTypes.EXAM ||
      this.type === ContestTypes.BALL;
  }

  isFinished(): boolean {
    return this.status === ContestStatus.FINISHED;
  }

  isAlready(): boolean {
    return this.status === ContestStatus.ALREADY;
  }

  isNotStarted(): boolean {
    return this.status === ContestStatus.NOT_STARTED;
  }

}
