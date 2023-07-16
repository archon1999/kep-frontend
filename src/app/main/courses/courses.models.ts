import { User } from "../users/users.models";

export interface Course {
    id: number;
    title: string;
    descriptionShort: string;
    description: string;
    points: number;
    rating: number;
    participantsCount: number;
    reviewsCount: number;
    participantProgress: number;
    participantPoints: number;
    lessonsCount: number;
    partsCount: number;
    tasksCount: number;
    lecturesCount: number;
    isStarted: boolean;
    inThePipeline: boolean;
    logo: string;
    level: number;
    levelTitle: string;
    tags: Array<any>;
    updated: string;
}

export enum CourseLessonPartStatus {
    FAILED = -1,
    NOT_COMPLETED,
    COMPLETED
}

export class CourseLessonPart {
    constructor(
        public id: number,
        public contentType: string,
        public status: number,
        public points: number,
        public content: any,
        public contentTypeIcon: string,
        public statusColor: string,
    ){}

    getClassOf(isCurrent: boolean){
        if(isCurrent){
            return `btn-outline-${this.statusColor}`;
        } else {
            return `btn-relief-${this.statusColor}`;
        }
    }

    updateStatus(newStatus: number){
        this.status = newStatus;
        this.statusColor = CourseLessonPart.getStatusColor(newStatus);
    }

    static getStatusColor(status: number){
        if(status == CourseLessonPartStatus.FAILED){
            return 'danger';
        } else if(status == CourseLessonPartStatus.NOT_COMPLETED){
            return 'dark';
        } else if(status == CourseLessonPartStatus.COMPLETED){
            return 'success';
        }
    }

    static getContentTypeIcon(contentType: string){
        if(contentType == 'lecture'){
            return 'learn';
        } else if(contentType == 'problem'){
            return 'custom_test';
        } else if(contentType == 'question'){
            return 'question';
        }
    }

    static fromJSON(data: any){
        return new CourseLessonPart(
            data.id,
            data.contentType,
            data.status,
            data.points,
            data.content,
            this.getContentTypeIcon(data.contentType),
            this.getStatusColor(data.status),
        )
    }
}

export class CourseLesson {
    constructor(
        public title: string,
        public progress: number,
        public parts: Array<CourseLessonPart>,
        public description: string,
        public image: string,
        public lecturesCount?: number,
        public tasksCount?: number,
    ){}

    static fromJSON(data: any){
        return new CourseLesson(
            data.title,
            data.progress,
            data.parts?.map((data: any) => CourseLessonPart.fromJSON(data)),
            data.description,
            data.image,
            data?.lecturesCount,
            data?.tasksCount,
        )
    }
}

export class CourseKeyword {
    constructor(
        public keyword: string,
        public meaning: string,
    ){}
}

export class CourseLessonPartComment {
    constructor(
        public id: number,
        public username: string,
        public userAvatar: string,
        public comment: string,
        public created: Date,
        public likes: number,
        public dislikes: number,
    ){}
}

export class CourseParticipantReview {
    constructor(
        public username: string,
        public userAvatar: string,
        public review: string,
        public rating: number,
        public participantProgress: number,
        public created: string,
    ){}
}

export class CourseParticipant {
    constructor(
        public username: string,
        public userAvatar: string,
        public hasReview: boolean,
        public progress: number,
        public points: number,
    ){}
}
