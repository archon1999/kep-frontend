import { Problem } from "app/main/problems/problems.models";
import { ContestStatus, ContestTypes } from "../../contests.models";

export class Contest {
    constructor(
        public id: number,
        public title: string,
        public status: number,
        public problemsCount: number,
        public solved: number,
        public isRegistered: boolean,
        public registrantsCount: number,
        public contestantsCount: number,
        public startTime: Date,
        public finishTime: Date,
        public type: string,
    ){}

    hasPenalties(): boolean {
        return this.type == ContestTypes.ACM20M || this.type == ContestTypes.ACM2H;
    }

    hasBalls(): boolean {
        return this.type == ContestTypes.BALL525 ||
               this.type == ContestTypes.BALL550 ||
               this.type == ContestTypes.LESS_CODE ||
               this.type == ContestTypes.LESS_LINE;
    }

    isFinished(): boolean {
        return this.status == ContestStatus.FINISHED;
    }

    isAlready(): boolean {
        return this.status == ContestStatus.ALREADY;
    }

    isNotStarted(): boolean {
        return this.status == ContestStatus.NOT_STARTED;
    }

    getBadgeType(): string {
        if(this.type == ContestTypes.ACM20M || this.type == ContestTypes.ACM2H){
            return 'primary';
        } else if(this.type == ContestTypes.BALL525 || this.type == ContestTypes.BALL550){
            return 'danger';
        } else if(this.type == ContestTypes.LESS_CODE || this.type == ContestTypes.LESS_LINE){
            return 'dark';
        }
    }

    static fromJSON(data: any){
        return new Contest(
            data.id,
            data.title,
            data.status,
            data.problemsCount,
            data.solved,
            data.isRegistered,
            data.registrantsCount,
            data.contestantsCount,
            new Date(data.startTime),
            new Date(data.finishTime),
            data.type,
        )
    }
}

export class Contestant {
    constructor(
        public type: number,
        public username: string,
        public problemsInfo: Array<ContestProblemInfo>,
        public points: number,
        public penalties: number,
        public rank: number,
        public rating: number,
        public ratingTitle: string,
        public perfomance: number,
        public perfomanceTitle: string,
    ){}

    static fromJSON(data: any){
        let problemsInfo: Array<ContestProblemInfo> = [];
        for(let problemInfo of data.problemsInfo){
            problemsInfo.push(ContestProblemInfo.fromJSON(problemInfo));
        }
        return new Contestant(
            data.type,
            data.username,
            problemsInfo,
            data.points,
            data.penalties,
            data.rank,
            data.rating,
            data.ratingTitle,
            data.perfomance,
            data.perfomanceTitle,
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
    ){}

    getCurrentBall(contest: Contest){
        if(contest.type == ContestTypes.BALL525){
            let coef = 25;
            let p = (Date.now().valueOf() - contest.startTime.valueOf()) / 1000;
            let q = (contest.finishTime.valueOf() - contest.startTime.valueOf()) / 1000;
            let c = p / q / 2;
            let initialBall = this.ball;
            let minPoints = initialBall * coef / 100;
            let points = Math.max(minPoints, initialBall * (1 - c));
            return Math.trunc(Math.min(points, initialBall));
        } else if(contest.type == ContestTypes.BALL550){
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

    static fromJSON(data: any){
        return new ContestProblem(
            data.problem,
            data.symbol,
            data.ball,
            data.attemptsCount,
            data.solved,
            data.attemptUsersCount,
            data.isSolved,
            data.isAttempted,
        )
    }
}

export class ContestProblemInfo {
    constructor(
        public problemSymbol: string,
        public points: number,
        public penalties: number,
        public attemptsCount: number,
        public firstAdoptedAttemptDatetime: string,
        public isFirstAdopted: boolean,
    ){}

    solved() : boolean {
        return this.firstAdoptedAttemptDatetime != null;
    }

    getContestTimeStr(contestTime, contestStartTime) : string {
        let milliSeconds = new Date(contestTime).getTime() - new Date(contestStartTime).getTime();
        let seconds = Math.trunc(milliSeconds / 1000);
        let minute = Math.trunc(seconds / 60);
        let hour = Math.trunc(minute / 60);
        minute %= 60;
        let result = '';
        result += hour < 10 ? '0' : Math.trunc(hour / 10);
        result += hour % 10;
        result += ':';
        result += minute < 10 ? '0' : Math.trunc(minute / 10);
        result += minute % 10;
        return result;
    }

    getHTML(contest: Contest): string {
        let html = '';
        if(contest.type == ContestTypes.ACM20M ||
           contest.type == ContestTypes.ACM2H ||
           contest.type == ContestTypes.ONE_ATTEMPT ||
           contest.type == ContestTypes.IQ){            
            if(this.solved()){
                let badgeClass: string;
                if(this.isFirstAdopted){
                    badgeClass = 'badge bg-success bg-darken-1 badge-glow';
                } else {
                    badgeClass = 'badge badge-light-success';
                }
                html = `<span class="${badgeClass}">`;
                html += '+';
                if(this.attemptsCount > 0){
                    html += this.attemptsCount;
                }
                html += '<br>';
                html += this.getContestTimeStr(this.firstAdoptedAttemptDatetime, contest.startTime);
                html += '</span>';
            } else if(this.attemptsCount > 0) {
                let badgeClass: string;
                if(this.attemptsCount > 0){
                    badgeClass = 'badge badge-light-danger';
                } else {
                    badgeClass = 'badge badge-light-warning';
                }
                html += `<span class="${badgeClass}">`;
                html += '-';
                if(this.attemptsCount > 0) {
                    html += this.attemptsCount;
                }
                html += '</span>';
            }
        } else if(contest.type == ContestTypes.BALL525 ||
                  contest.type == ContestTypes.BALL550 ||
                  contest.type == ContestTypes.EXAM){
            if(this.solved()){
                let badgeClass: string;
                if(this.isFirstAdopted){
                    badgeClass = 'badge bg-success bg-darken-1 badge-glow';
                } else {
                    badgeClass = 'badge badge-light-success';
                }
                html += `<span class="${badgeClass}">`;
                html += '<b class="text-dark">';
                html += this.points;
                html += '</b>';
                html += '<br>';
                html += '<span class="contest-time-sm">';
                html += this.getContestTimeStr(this.firstAdoptedAttemptDatetime, contest.startTime);
                html += '</span>';
                html += '</span>';
            } else {
                if(this.points > 0){
                    let badgeClass = 'badge badge-light-dark';
                    html += `<span class="${badgeClass}">`;
                    html += this.points;
                    html += '</span>';
                } else {
                    let badgeClass: string;
                    if(this.attemptsCount > 0){
                        badgeClass = 'badge badge-light-danger';
                    } else {
                        badgeClass = 'badge badge-light-warning';
                    }
                    html += `<span class="${badgeClass}">`;
                    html += '-';
                    if(this.attemptsCount > 0) {
                        html += this.attemptsCount;
                    }
                    html += '</span>';
                }
            }
        } else if(contest.type == ContestTypes.LESS_CODE){
            if(this.solved()){
                let badgeClass: string;
                if(this.isFirstAdopted){
                    badgeClass = 'badge badge-dark badge-glow';
                } else {
                    badgeClass = 'badge badge-light-dark';
                }
                html += `<span class="${badgeClass}">`;
                html += '<span class="less-code">'
                html += this.points;
                html += '</span>';
                html += '</span>';
            } else {
                html += `<span class="badge badge-light-danger">`;
                html += '-';
                html += '</span>';
            }
        } else if(contest.type == ContestTypes.LESS_LINE){
            if(this.solved()){
                let badgeClass: string;
                if(this.isFirstAdopted){
                    badgeClass = 'badge badge-dark badge-glow';
                } else {
                    badgeClass = 'badge badge-light-dark';
                }
                html += `<span class="${badgeClass}">`;
                html += '<span class="less-code">'
                html += this.points + '/' + 10;
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
    
    static fromJSON(data: any){
        return new ContestProblemInfo(
            data.problemSymbol,
            data.points,
            data.penalties,
            data.attemptsCount,
            data.firstAdoptedAttemptDatetime,
            data.isFirstAdopted,
        );
    }

}
