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
  levelColor: string;
  levelDisplay: string;
}
