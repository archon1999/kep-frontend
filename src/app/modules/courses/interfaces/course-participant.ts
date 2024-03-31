export class CourseParticipant {
  constructor(
    public username: string,
    public userAvatar: string,
    public hasReview: boolean,
    public progress: number,
    public points: number,
  ) {}
}
