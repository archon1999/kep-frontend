import { User } from "app/main/users/users.models";

export class CurrentProblemsRating {
    constructor(
        public username: string,
        public solved: number,
        public ratingTitle: string,
    ){}
}

export class ProblemsRating {
    constructor(
        public user: User,
        public solved: number,
        public rating: number,
        public beginner: number,
        public basic: number,
        public normal: number,
        public medium: number,
        public hard: number,
        public extremal: number,
    ){}
}
