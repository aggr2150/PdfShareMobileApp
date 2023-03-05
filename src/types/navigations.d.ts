declare type BottomTabParamList = {
  HomeTab: undefined;
  SearchTab: import('@react-navigation/native').NavigatorScreenParams<SearchStackScreenParams>;
  UploadTab: undefined;
  HistoryTab: import('@react-navigation/native').NavigatorScreenParams<HistoryStackScreenParams>;
  ProfileTab: import('@react-navigation/native').NavigatorScreenParams<ProfileStackScreenParams>;
};
declare type ProfileStackScreenParams = {
  My: undefined;
  Revenue: undefined;
  Profile: IUser | {id: string};
  Information: IUser;
};
declare type HistoryStackScreenParams = {
  History: undefined;
  Collection: {_id: string};
};

declare type SearchStackScreenParams = {
  Search: undefined;
  SearchResult: {keyword: string};
};

interface IID {
  id: string;
}
type Viewer = IID | IPost;

declare type RootStackParamList = {
  Tabs: import('@react-navigation/native').NavigatorScreenParams<BottomTabParamList>;
  ProfileTab: undefined;
  Collection: {_id: string};
  Viewer:
    | {
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
    | {id: string};
  SignIn: undefined;
  Comments: {postId: string};
  Replies: IComment;
  HistoryTab: undefined;
  History: undefined;
  SearchTab: undefined;
  Revenue: undefined;
  SearchResult: {keyword: string};
  EditProfile: {
    id: string;
    nickname: string;
    description?: string;
    link?: string;
    avatar?: IFile;
  };
  My: undefined;
  // Profile: IUser | {id: string};
  Settings: undefined;
  BlockList: undefined;
  // CollectionList: undefined;
  Upload: undefined;
  // UploadTab: undefined;
  EditPost: IPost;

  ResetPassword: undefined;
  ResetPasswordConfirm: {
    email: string;
    verificationCode: string;
  };
  ChangePassword: undefined;
  Home: undefined;
};
