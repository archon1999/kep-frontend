import { Problem } from '../problems/models/problems.models';

export enum ContestTypes {
  ACM20M = 'ACM20M',
  ACM2H = 'ACM2H',
  BALL525 = 'Ball525',
  BALL550 = 'Ball550',
  LESS_CODE = 'LessCode',
  LESS_LINE = 'LessLine',
  ONE_ATTEMPT = 'OneAttempt',
  EXAM = 'Exam',
  IQ = 'IQ',
  MULTI_LINGUAL = 'MultiL',
  DC = 'DC',
  CODE_GOLF = 'CodeGolf',
  BALL = 'Ball',
}

export enum ContestStatus {
  NOT_STARTED = -1,
  ALREADY = 0,
  FINISHED = 1,
}

export interface ContestAuthor {
  username: string;
  ratingTitle: string;
}

export interface ContestUserInfo {
  isParticipated: boolean;
  isRegistered: boolean;
  doubleRatingPurchased: boolean;
  saveRatingPurchased: boolean;
  virtualContestPurchased: boolean;
  unratedContestPurchased: boolean;
}

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
    public type: string,
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

export class ContestantTeamMember {
  username: string;
  rating: number;
  ratingTitle: string;
  newRating: number;
  newRatingTitle: string;
}

export class Contestant {
  constructor(
    public username: string,
    public team: Array<ContestantTeamMember>,
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
    public virtualTime: string,
  ) {}

  static fromJSON(data: any) {
    return new Contestant(
      data.username,
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
      data.virtualTime,
    );
  }
}

export class ContestProblem {
  constructor(
    public problem: Problem,
    public symbol: string,
    public ball: number,
    public attemptsCount: number,
    public solved: number,
    public attemptUsersCount: number,
    public isSolved: boolean,
    public isAttempted: boolean,
  ) {
  }

  static fromJSON(data: any) {
    return new ContestProblem(
      data.problem,
      data.symbol,
      data.ball,
      data.attemptsCount,
      data.solved,
      data.attemptUsersCount,
      data.isSolved,
      data.isAttempted,
    );
  }

  getCurrentBall(contest: Contest) {
    if (contest.type == ContestTypes.BALL525) {
      let coef = 25;
      let p = (Date.now().valueOf() - contest.startTime.valueOf()) / 1000;
      let q = (contest.finishTime.valueOf() - contest.startTime.valueOf()) / 1000;
      let c = p / q / 2;
      let initialBall = this.ball;
      let minPoints = initialBall * coef / 100;
      let points = Math.max(minPoints, initialBall * (1 - c));
      return Math.trunc(Math.min(points, initialBall));
    } else if (contest.type == ContestTypes.BALL550) {
      let coef = 50;
      let p = (Date.now().valueOf() - contest.startTime.valueOf()) / 1000;
      let q = (contest.finishTime.valueOf() - contest.startTime.valueOf()) / 1000;
      let c = p / q / 4;
      let initialBall = this.ball;
      let minPoints = initialBall * coef / 100;
      let points = Math.max(minPoints, initialBall * (1 - c));
      return Math.trunc(Math.min(points, initialBall));
    } else {
      return this.ball;
    }
  }
}

export class ContestProblemInfo {
  constructor(
    public problemSymbol: string,
    public points: number,
    public penalties: number,
    public attemptsCount: number,
    public firstAcceptedTime: string,
    public theBest: boolean,
    public contestTime: string,
  ) {
  }

  static fromJSON(data: any) {
    return new ContestProblemInfo(
      data.problemSymbol,
      data.points,
      data.penalties,
      data.attemptsCount,
      data.firstAcceptedTime,
      data.theBest,
      data.contestTime,
    );
  }

  solved(): boolean {
    return this.firstAcceptedTime != null;
  }

  getHTML(contest: Contest): string {
    let html = '';
    if (contest.type == ContestTypes.ACM20M ||
      contest.type == ContestTypes.ACM2H ||
      contest.type == ContestTypes.ONE_ATTEMPT ||
      contest.type == ContestTypes.IQ) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge badge-glow badge-success the-best';
        } else {
          badgeClass = 'badge badge-light-success';
        }
        html = `<span class="${ badgeClass }">`;
        html += '+';
        if (this.attemptsCount > 0) {
          html += this.attemptsCount;
        }
        html += '<br>';
        html += this.contestTime;
        html += '</span>';
      } else if (this.attemptsCount > 0) {
        let badgeClass: string;
        if (this.attemptsCount > 0) {
          badgeClass = 'badge badge-light-danger';
        } else {
          badgeClass = 'badge badge-light-warning';
        }
        html += `<span class="${ badgeClass }">`;
        html += '-';
        if (this.attemptsCount > 0) {
          html += this.attemptsCount;
        }
        html += '</span>';
      }
    } else if (contest.type == ContestTypes.BALL525 ||
      contest.type == ContestTypes.BALL550 ||
      contest.type == ContestTypes.EXAM) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge problem-points the-best';
        } else {
          badgeClass = 'badge problem-points';
        }
        html += `<span class="${ badgeClass }">`;
        html += '<b class="text-dark">';
        html += this.points;
        html += '</b>';
        html += '<br>';
        html += '<span class="contest-time-sm">';
        html += this.contestTime;
        html += '</span>';
        html += '</span>';
      } else {
        if (this.points > 0) {
          let badgeClass = 'badge badge-light-dark';
          html += `<span class="${ badgeClass }">`;
          html += this.points;
          html += '</span>';
        } else {
          let badgeClass: string;
          if (this.attemptsCount > 0) {
            badgeClass = 'badge badge-light-danger';
          } else {
            badgeClass = 'badge badge-light-warning';
          }
          html += `<span class="${ badgeClass }">`;
          html += '-';
          if (this.attemptsCount > 0) {
            html += this.attemptsCount;
          }
          html += '</span>';
        }
      }
    } else if (contest.type == ContestTypes.LESS_CODE) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge badge-dark badge-glow';
        } else {
          badgeClass = 'badge badge-light-dark';
        }
        html += `<span class="${ badgeClass }">`;
        html += '<span class="less-code">';
        html += this.points;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge badge-light-danger">`;
        html += '-';
        html += '</span>';
      }
    } else if (contest.type == ContestTypes.LESS_LINE) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge badge-dark badge-glow';
        } else {
          badgeClass = 'badge badge-light-dark';
        }
        html += `<span class="${ badgeClass }">`;
        html += '<span class="less-code">';
        html += this.points + '/' + 10;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge badge-light-danger">`;
        html += '-';
        html += '</span>';
      }
    } else if (contest.type == ContestTypes.MULTI_LINGUAL) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge problem-points the-best';
        } else {
          badgeClass = 'badge problem-points';
        }
        html += `<span class="${ badgeClass }">`;
        html += '<span class="multi-l">';
        html += this.points + '/' + 10;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge badge-light-danger">`;
        html += '-';
        html += '</span>';
      }
    } else if (contest.type == ContestTypes.DC || contest.type == ContestTypes.CODE_GOLF) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge problem-points the-best';
        } else {
          badgeClass = 'badge problem-points';
        }
        html += `<span class="${ badgeClass }">`;
        html += '<span class="multi-l">';
        html += this.points;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge badge-light-danger">`;
        html += '-';
        html += '</span>';
      }
    }
    return html;
  }

}

export class ContestsRating {
  constructor(
    public username: string,
    public rating: number,
    public ratingTitle: string,
    public contestantsCount: number,
  ) {
  }

  static fromJSON(data: any) {
    return new ContestsRating(
      data.username,
      data.rating,
      data.ratingTitle,
      data.contestantsCount,
    );
  }

  getBadgeClass() {
    if (this.rating >= 2000) {
      return 'dark';
    }

    if (this.rating >= 1800) {
      return 'warning';
    }

    if (this.rating >= 1600) {
      return 'primary';
    }

    if (this.rating >= 1200) {
      return 'success';
    }

    return 'secondary';
  }
}

export class ContestAttemptsFilter {
  userOnly?: boolean;
  verdict?: number;
  contestProblem?: string;
}


export interface ContestQuestion {
  problemSymbol: string;
  problemTitle: string;
  username: string;
  ratingTitle: string;
  question: string;
  answer: string | null;
  created: string;
}
