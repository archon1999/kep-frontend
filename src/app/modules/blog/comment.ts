import { User } from '../users/users.models';

export class Comment {
  constructor(
    public id: number,
    public user: User,
    public blogId: number,
    public blogTitle: string,
    public body: string,
    public created: string
  ) {}
}
