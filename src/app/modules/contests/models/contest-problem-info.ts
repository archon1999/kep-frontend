import { ContestTypes } from '@contests/constants';

import { Contest } from '@contests/models/contest';

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
    if (contest.type === ContestTypes.ACM20M ||
      contest.type === ContestTypes.ACM10M ||
      contest.type === ContestTypes.ACM2H ||
      contest.type === ContestTypes.ONE_ATTEMPT ||
      contest.type === ContestTypes.IQ) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge bg-success the-best';
        } else {
          badgeClass = 'badge bg-success-transparent';
        }
        html = `<span class="${badgeClass}">`;
        html += `<div class="mb-1">+${this.attemptsCount > 0 ? this.attemptsCount : ''}</div>`;
        html += this.contestTime;
        html += '</span>';
      } else if (this.attemptsCount > 0) {
        let badgeClass: string;
        if (this.attemptsCount > 0) {
          badgeClass = 'badge bg-danger-transparent';
        } else {
          badgeClass = 'badge bg-warning-transparent';
        }
        html += `<span class="${badgeClass}">`;
        html += '-';
        if (this.attemptsCount > 0) {
          html += this.attemptsCount;
        }
        html += '</span>';
      }
    } else if (
      contest.type === ContestTypes.BALL525 ||
      contest.type === ContestTypes.BALL550 ||
      contest.type === ContestTypes.EXAM
    ) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge problem-points the-best';
        } else {
          badgeClass = 'badge problem-points';
        }
        html += `<span class="${badgeClass}">`;
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
          const badgeClass = 'badge bg-dark-transparent';
          html += `<span class="${badgeClass}">`;
          html += this.points;
          html += '</span>';
        } else {
          let badgeClass: string;
          if (this.attemptsCount > 0) {
            badgeClass = 'badge bg-danger-transparent';
          } else {
            badgeClass = 'badge bg-warning-transparent';
          }
          html += `<span class="${badgeClass}">`;
          html += '-';
          if (this.attemptsCount > 0) {
            html += this.attemptsCount;
          }
          html += '</span>';
        }
      }
    } else if (contest.type === ContestTypes.LESS_CODE) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge bg-dark';
        } else {
          badgeClass = 'badge bg-dark-transparent';
        }
        html += `<span class="${badgeClass}">`;
        html += '<span class="less-code">';
        html += this.points;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge bg-danger-transparent">`;
        html += '-';
        html += '</span>';
      }
    } else if (contest.type === ContestTypes.LESS_LINE) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge badge-dark';
        } else {
          badgeClass = 'badge badge-light-dark';
        }
        html += `<span class="${badgeClass}">`;
        html += '<span class="less-code">';
        html += this.points + '/' + 10;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge bg-danger-transparent">`;
        html += '-';
        html += '</span>';
      }
    } else if (contest.type === ContestTypes.MULTI_LINGUAL) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge problem-points the-best';
        } else {
          badgeClass = 'badge problem-points';
        }
        html += `<span class="${badgeClass}">`;
        html += '<span class="multi-l">';
        html += this.points + '/' + 10;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge bg-danger-transparent">`;
        html += '-';
        html += '</span>';
      }
    } else if (contest.type === ContestTypes.DC || contest.type === ContestTypes.CODE_GOLF) {
      if (this.solved()) {
        let badgeClass: string;
        if (this.theBest) {
          badgeClass = 'badge problem-points the-best';
        } else {
          badgeClass = 'badge problem-points';
        }
        html += `<span class="${badgeClass}">`;
        html += '<span class="multi-l">';
        html += this.points;
        html += '</span>';
        html += '</span>';
      } else {
        html += `<span class="badge bg-danger-transparent">`;
        html += '-';
        html += '</span>';
      }
    }
    return html;
  }

}
