declare interface IAuthor {
  _id: string;
  id: string;
  nickname: string;
  avatar?: IFile;
}
declare interface IFile {
  _id?: string;
  originalFilename?: string;
  filepath: string;
  blurFilepath?: string;
}
declare interface ILikePost extends ILike, IPost {}
declare interface ILike {
  _id: string;
  likeAt: string;
}

declare interface IHistoryPost extends IPost {
  timestamp: string;
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

declare interface ICollection {
  _id: string;
  title: string;
  user: IAuthor;
  posts: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

declare interface ISession {
  _id?: string;
  id?: string;
  nickname?: string;
  email: string;
}
declare interface IBlockUser {
  _id: string;
  id: string;
  nickname: string;
}

declare enum ENotificationType {
  'notice' = 'notice',
  'social' = 'social',
}

declare enum EActionType {
  'none' = 'none',
  'upload' = 'upload',
  'comment' = 'comment',
  'mention' = 'mention',
  'likePost' = 'likePost',
  'likeComment' = 'likeComment',
  'subscribe' = 'subscribe',
}
declare interface INotification<T> {
  _id: string;
  toUser?: IAuthor;
  fromUser: IAuthor | undefined;
  notificationType: ENotificationType;
  actionType: EActionType;
  post?: IPost;
  title: string;
  body: string;
  route: string;
  data: T;
  createdAt: Date;
}

declare interface IUser extends ISession {
  _id: string;
  id: string;
  nickname: string;
  avatar?: IFile;
  link: string;
  description: string;
  postCounter: number;
  subscriberCounter: number;
  subscribingCounter: number;
  subscribeStatus?: boolean;
  subscribedAt?: Date;
}
declare interface IComment {
  _id: string;
  author: IAuthor;
  postId: string;
  parentCommentId?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likeCounter: number;
  replyCounter?: number;
  likeStatus: boolean;
  isDeleted: boolean;
}
type TSettlement = {
  postViewCounter: number;
  settledAmount: number;
  settledViewCounter: number;
};
