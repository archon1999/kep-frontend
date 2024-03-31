export interface CourseLessonPartComment {
  id: number;
  username: string;
  userAvatar: string;
  comment: string;
  created: Date;
  likes: number;
  dislikes: number;
}
