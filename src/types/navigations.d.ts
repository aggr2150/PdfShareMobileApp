declare type RootStackParamList = {
  Tabs: undefined;
  Viewer: undefined | IPost;
  SignIn: undefined;
  Comments: undefined;
  History: undefined;
  EditProfile: {
    id: string;
    nickname: string;
    description?: string;
  };
  Profile: undefined | IUser;
  Settings: undefined;
  CollectionList: undefined;
  Upload: undefined;
};
