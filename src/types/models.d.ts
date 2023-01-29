declare interface IAuthor {
  _id: string;
  id: string;
  nickname: string;
}
declare interface IFile {
  _id: string;
  originalFilename?: string;
  filepath: string;
  blurFilepath?: string;
}
declare interface IPost {
  _id: string;
  author: IAuthor;
  title: string;
  content: string;
  tag: string[];
  thumbnail?: IFile;
  documentThumbnail: IFile;
  document: IFile;
  viewCounter: number;
  likeCounter: number;
  commentCounter: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  likeStatus: boolean;
}

declare interface ISession {
  userId?: string;
  id?: string;
  nickname?: string;
  email: string;
}

declare interface IUser extends ISession {
  _id: string;
  id: string;
  nickname: string;
  avatar?: IFile;

  postCounter: number;
  subscriberCounter: number;
  subscribingCounter?: number;
  subscribeStatus?: boolean;
}
