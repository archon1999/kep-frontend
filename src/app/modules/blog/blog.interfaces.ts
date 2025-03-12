export class Blog {
  constructor(
    public id: number,
    public author: any,
    public title: string,
    public body: string,
    public bodyShort: string,
    public image: string,
    public views: number,
    public likesCount: number,
    public commentsCount: number,
    public tags: Array<string>,
    public created: Date,
  ) {}
}

export class BlogPostComment {
  constructor(
    public id: number,
    public username: string,
    public userAvatar: string,
    public likes: number,
    public reply: any,
    public body: string,
    public created: string,
  ) {}
}
